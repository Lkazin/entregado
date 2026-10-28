import { NextResponse } from "next/server";
import { validateStoreApiKey } from "@/lib/auth-middleware";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const maxUses = Number(body.maxUses) || 1;
    const validityHours = Number(body.validityHours) || 48;

    const invite = await db.generateStoreInvite(auth.storeId, maxUses, validityHours);

    const shareMessage = `Olá! Para receber entregas da nossa loja no app NovaesWeb Entregador, acesse o aplicativo e use nosso código de vinculação: *${invite.code}*`;

    return NextResponse.json({
      success: true,
      invite: {
        code: invite.code,
        maxUses: invite.maxUses,
        expiresAt: invite.expiresAt,
        shareText: shareMessage,
      },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao gerar código de convite para a loja." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const invites = await db.listStoreInvites(auth.storeId);
    return NextResponse.json({
      success: true,
      storeId: auth.storeId,
      invites: invites.map((i) => ({
        code: i.code,
        maxUses: i.maxUses,
        usedCount: i.usedCount,
        isRevoked: i.isRevoked,
        expiresAt: i.expiresAt,
        createdAt: i.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao listar convites da loja." },
      { status: 500 }
    );
  }
}
