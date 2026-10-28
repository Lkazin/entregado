import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Informe o código de 4 dígitos" }, { status: 400 });
    }

    const result = await db.confirmDelivery(id, code);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao confirmar entrega" }, { status: 500 });
  }
}
