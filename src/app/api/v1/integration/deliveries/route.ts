import { NextResponse } from "next/server";
import { validateStoreApiKey } from "@/lib/auth-middleware";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const body = await request.json();
    const {
      externalOrderId,
      idempotencyKey,
      assignedDriverId,
      customer,
      orderValue,
      deliveryFee,
      confirmationCode,
    } = body;

    if (!assignedDriverId || !customer?.name || !customer?.address) {
      return NextResponse.json(
        {
          error: "Dados incompletos: 'assignedDriverId', 'customer.name' e 'customer.address' são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const result = await db.dispatchJob(auth.storeId, {
      externalOrderId,
      idempotencyKey,
      assignedDriverId,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone?.trim() || "(51) 99999-9999",
        address: customer.address.trim(),
        neighborhood: customer.neighborhood?.trim() || "Bairro Centro",
      },
      orderValue: Number(orderValue) || 40.0,
      deliveryFee: deliveryFee !== undefined ? Number(deliveryFee) : undefined,
      confirmationCode: confirmationCode || "1742",
    });

    return NextResponse.json(
      {
        success: true,
        isDuplicate: result.isDuplicate,
        delivery: {
          id: result.job.id,
          orderNumber: result.job.orderNumber,
          externalOrderId: result.job.externalOrderId,
          status: result.job.status,
          assignedDriver: {
            id: result.job.assignedCourierId,
            name: result.job.assignedCourierName,
          },
          orderValue: result.job.orderValue,
          deliveryFee: result.job.deliveryFee,
          customer: {
            name: result.job.customerName,
            phone: result.job.customerPhone,
            address: result.job.destinationAddress,
            neighborhood: result.job.destinationNeighborhood,
          },
          confirmationCode: result.job.confirmationCode,
          createdAt: result.job.createdAt,
        },
      },
      { status: result.isDuplicate ? 200 : 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao despachar entrega." },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const jobs = await db.listStoreJobs(auth.storeId);
    return NextResponse.json({
      success: true,
      storeId: auth.storeId,
      total: jobs.length,
      deliveries: jobs.map((j) => ({
        id: j.id,
        orderNumber: j.orderNumber,
        externalOrderId: j.externalOrderId,
        status: j.status,
        assignedDriver: {
          id: j.assignedCourierId,
          name: j.assignedCourierName,
        },
        orderValue: j.orderValue,
        deliveryFee: j.deliveryFee,
        customerName: j.customerName,
        destinationAddress: j.destinationAddress,
        destinationNeighborhood: j.destinationNeighborhood,
        confirmationCode: j.confirmationCode,
        createdAt: j.createdAt,
        deliveredAt: j.deliveredAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao listar entregas da loja." },
      { status: 500 }
    );
  }
}
