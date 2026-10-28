import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@/types/delivery";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const courierId = searchParams.get("courierId");
  const storeId = searchParams.get("storeId");

  let orders = [];

  if (courierId && storeId) {
    orders = await db.getOrdersForCourier(courierId, storeId);
  } else if (storeId) {
    const all = await db.getAllOrders();
    orders = all.filter((o) => o.storeId === storeId);
  } else if (courierId) {
    const all = await db.getAllOrders();
    orders = all.filter((o) => !o.assignedCourierId || o.assignedCourierId === courierId);
  } else {
    orders = await db.getAllOrders();
  }

  if (statusFilter && statusFilter !== "todas") {
    if (statusFilter === "em_andamento") {
      orders = orders.filter(
        (o) => o.status === "aguardando_retirada" || o.status === "em_rota"
      );
    } else if (statusFilter === "concluida") {
      orders = orders.filter((o) => o.status === "concluida");
    } else {
      orders = orders.filter((o) => o.status === statusFilter);
    }
  }

  const nextOrder = await db.getNextOrder(courierId || undefined, storeId || undefined);

  return NextResponse.json({
    orders,
    nextOrder,
  });
}

// Create or dispatch order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await db.createOrder({
      orderNumber: body.orderNumber,
      storeId: body.storeId || "store-acai-01",
      storeName: body.storeName || "Açaí do Rei",
      storeAddress: body.storeAddress || "Av. Boqueirão, 1200 - Canoas/RS",
      assignedCourierId: body.assignedCourierId || "mb-001",
      assignedCourierName: body.assignedCourierName || "Carlos Silva",
      status: (body.status as OrderStatus) || "aguardando_retirada",
      orderValue: body.orderValue || 45.9,
      deliveryFee: body.deliveryFee || 8.0,
      itemsCount: body.itemsCount || 2,
      customerName: body.customerName || "Lucas Silveira",
      customerPhone: body.customerPhone || "(51) 98765-4321",
      destinationAddress: body.destinationAddress || "Rua das Flores, 456",
      destinationNeighborhood: body.destinationNeighborhood || "Bairro Centro - Canoas/RS",
      distanceKm: body.distanceKm || 2.8,
      estimatedMinutes: body.estimatedMinutes || 7,
      confirmationCode: body.confirmationCode || "1742",
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
