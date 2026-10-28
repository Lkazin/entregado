import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await context.params;
    const couriers = await db.getStoreCouriers(storeId);
    return NextResponse.json({ success: true, couriers });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao listar entregadores da loja" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await context.params;
    const body = await request.json();
    const { courierId } = body;

    if (!courierId) {
      return NextResponse.json({ error: "Informe o ID do entregador a desvincular" }, { status: 400 });
    }

    const success = await db.revokeCourierAccess(storeId, courierId);
    return NextResponse.json({ success, message: "Acesso do entregador revogado com sucesso" });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao desvincular entregador" }, { status: 500 });
  }
}
