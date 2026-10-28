import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await context.params;
    const invites = await db.listStoreInvites(storeId);
    return NextResponse.json({ success: true, invites });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao listar convites da loja" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const maxUses = Number(body.maxUses) || 1;
    const validityHours = Number(body.validityHours) || 48;

    const invite = await db.generateStoreInvite(storeId, maxUses, validityHours);
    return NextResponse.json({ success: true, invite }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao gerar convite" }, { status: 400 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { inviteId } = body;
    if (!inviteId) {
      return NextResponse.json({ error: "Informe o ID do convite a revogar" }, { status: 400 });
    }

    const success = await db.revokeStoreInvite(inviteId);
    return NextResponse.json({ success });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao revogar convite" }, { status: 500 });
  }
}
