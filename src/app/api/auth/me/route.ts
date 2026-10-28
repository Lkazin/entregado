import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const motoboy = await db.getMotoboy();
  return NextResponse.json({ motoboy });
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const updated = await db.updateMotoboy(updates);
    return NextResponse.json({ success: true, motoboy: updated });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao atualizar perfil" }, { status: 500 });
  }
}
