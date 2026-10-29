import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("motoboys").select("*");
    if (!error && data && data.length > 0) {
      return NextResponse.json({ motoboys: data });
    }
  } catch {
    // Fallback
  }

  const motoboy = await db.getMotoboy();
  return NextResponse.json({
    motoboys: [motoboy],
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const updated = await db.updateMotoboy(updates);
    return NextResponse.json({ success: true, motoboy: updated });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar motoboy" }, { status: 500 });
  }
}
