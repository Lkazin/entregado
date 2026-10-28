import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await context.params;
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      destinationAddress,
      destinationNeighborhood,
      orderValue,
      deliveryFee,
      assignedCourierId,
      confirmationCode,
    } = body;

    if (!customerName || !destinationAddress || !assignedCourierId) {
      return NextResponse.json(
        { error: "Dados incompletos: nome do cliente, endereço e entregador são obrigatórios." },
        { status: 400 }
      );
    }

    const order = await db.createStoreOrder(storeId, {
      customerName,
      customerPhone: customerPhone || "(51) 98765-4321",
      destinationAddress,
      destinationNeighborhood: destinationNeighborhood || "Centro",
      orderValue: Number(orderValue) || 45.0,
      deliveryFee: Number(deliveryFee) || 8.0,
      assignedCourierId,
      confirmationCode: confirmationCode || "1742",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao despachar pedido" }, { status: 500 });
  }
}
