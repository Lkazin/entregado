import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courierId = searchParams.get("courierId") || undefined;
  const storeId = searchParams.get("storeId") || undefined;

  const stats = await db.getStats(courierId, storeId);
  return NextResponse.json(stats);
}
