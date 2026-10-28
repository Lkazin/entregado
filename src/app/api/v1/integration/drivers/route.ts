import { NextResponse } from "next/server";
import { validateStoreApiKey } from "@/lib/auth-middleware";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const couriers = await db.getStoreCouriers(auth.storeId);
    return NextResponse.json({
      success: true,
      storeId: auth.storeId,
      drivers: couriers.map((c) => ({
        id: c.courierId,
        name: c.courierName,
        phone: c.courierPhone,
        vehicleModel: c.courierVehicle,
        vehiclePlate: c.courierPlate,
        status: c.status,
        linkedAt: c.linkedAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao consultar entregadores da loja." },
      { status: 500 }
    );
  }
}
