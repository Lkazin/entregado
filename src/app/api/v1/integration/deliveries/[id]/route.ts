import { NextResponse } from "next/server";
import { validateStoreApiKey } from "@/lib/auth-middleware";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const { id: deliveryId } = await context.params;
    const job = await db.getOrderById(deliveryId);

    if (!job || job.storeId !== auth.storeId) {
      return NextResponse.json(
        { error: `Entrega '${deliveryId}' não encontrada nesta loja.` },
        { status: 404 }
      );
    }

    const events = await db.listJobEvents(job.id);

    return NextResponse.json({
      success: true,
      delivery: {
        id: job.id,
        orderNumber: job.orderNumber,
        externalOrderId: job.externalOrderId,
        status: job.status,
        assignedDriver: {
          id: job.assignedCourierId,
          name: job.assignedCourierName,
        },
        orderValue: job.orderValue,
        deliveryFee: job.deliveryFee,
        customer: {
          name: job.customerName,
          phone: job.customerPhone,
          address: job.destinationAddress,
          neighborhood: job.destinationNeighborhood,
        },
        confirmationCode: job.confirmationCode,
        createdAt: job.createdAt,
        dispatchedAt: job.dispatchedAt,
        deliveredAt: job.deliveredAt,
      },
      timeline: events.map((e) => ({
        event: e.eventType,
        fromStatus: e.fromStatus,
        toStatus: e.toStatus,
        actorType: e.actorType,
        createdAt: e.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao consultar entrega." },
      { status: 500 }
    );
  }
}
