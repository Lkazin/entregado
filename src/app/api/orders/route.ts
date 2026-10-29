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
    if (!body.storeId || !body.storeName) {
      return NextResponse.json({ error: "Identificação da loja (storeId e storeName) é obrigatória." }, { status: 400 });
    }

    const newOrder = await db.createOrder({
      orderNumber: body.orderNumber || `#${Math.floor(1000 + Math.random() * 9000)}`,
      storeId: body.storeId,
      storeName: body.storeName,
      storeAddress: body.storeAddress || "",
      assignedCourierId: body.assignedCourierId || "",
      assignedCourierName: body.assignedCourierName || "Entregador",
      status: (body.status as OrderStatus) || "aguardando_retirada",
      orderValue: Number(body.orderValue || 0),
      deliveryFee: Number(body.deliveryFee || 0),
      itemsCount: Number(body.itemsCount || 1),
      customerName: body.customerName || "Cliente",
      customerPhone: body.customerPhone || "",
      destinationAddress: body.destinationAddress || "",
      destinationNeighborhood: body.destinationNeighborhood || "",
      distanceKm: Number(body.distanceKm || 0),
      estimatedMinutes: Number(body.estimatedMinutes || 0),
      confirmationCode: body.confirmationCode || `${Math.floor(10 + Math.random() * 90)}`,
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
