import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const motoboy = await db.getMotoboy();
    const courierId = searchParams.get("courierId") || motoboy.id;

    const links = await db.getCourierStores(courierId);
    return NextResponse.json({ success: true, links });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao obter lojas vinculadas" }, { status: 500 });
  }
}
