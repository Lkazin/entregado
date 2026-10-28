import { NextResponse } from "next/server";
import { validateStoreApiKey } from "@/lib/auth-middleware";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await validateStoreApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const { id: driverId } = await context.params;
    const success = await db.revokeCourierAccess(auth.storeId, driverId);

    if (!success) {
      return NextResponse.json(
        { error: `Entregador '${driverId}' não encontrado ou já revogado nesta loja.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Acesso do entregador '${driverId}' revogado com sucesso.`,
      storeId: auth.storeId,
      driverId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao revogar acesso do entregador." },
      { status: 500 }
    );
  }
}
