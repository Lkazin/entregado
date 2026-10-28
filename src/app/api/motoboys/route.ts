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
    motoboys: [
      motoboy,
      {
        id: "mb-002",
        name: "Marcos Oliveira",
        email: "marcos@loja.com",
        phone: "(11) 98234-5678",
        vehicleModel: "Yamaha Factor 150",
        vehiclePlate: "FLX-4A20",
        rating: 4.8,
        totalDeliveries: 312,
        storeName: "Burger House",
        isOnline: false,
      },
    ],
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
