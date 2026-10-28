import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const stores = await db.getStores();
  const activeStore = await db.getActiveStore();
  return NextResponse.json({ stores, activeStore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, phone, defaultDeliveryFee, category } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Informe o nome da loja" }, { status: 400 });
    }

    const created = await db.addStore({
      name: name.trim(),
      category: category?.trim() || "Delivery",
      address: address?.trim() || "Endereço não informado",
      phone: phone?.trim() || "(11) 99999-9999",
      defaultDeliveryFee: Number(defaultDeliveryFee) || 8.0,
    });

    return NextResponse.json({ success: true, store: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao cadastrar loja" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json({ error: "Informe o ID da loja" }, { status: 400 });
    }

    const switched = await db.setActiveStore(storeId);
    if (!switched) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, activeStore: switched });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao alternar loja" }, { status: 500 });
  }
}
