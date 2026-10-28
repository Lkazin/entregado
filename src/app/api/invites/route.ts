import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courierId, code } = body;

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "Informe o código da loja fornecido pelo lojista" },
        { status: 400 }
      );
    }

    const motoboy = await db.getMotoboy();
    const targetCourierId = courierId || motoboy.id;

    const result = await db.validateAndLinkInvite(targetCourierId, code);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Vinculado com sucesso à loja ${result.link?.storeName}!`,
      link: result.link,
    });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao processar código de vinculação" }, { status: 500 });
  }
}
