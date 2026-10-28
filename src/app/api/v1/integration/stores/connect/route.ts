import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { storeId, name, address, phone, defaultDeliveryFee, category, webhookUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "O nome do estabelecimento é obrigatório." },
        { status: 400 }
      );
    }

    const officialStoreId = (storeId || name.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    let store = await db.getStoreById(officialStoreId);
    if (!store) {
      store = await db.createStore({
        id: officialStoreId,
        name: name.trim(),
        category: category?.trim() || "Delivery",
        address: address?.trim() || "Endereço comercial",
        phone: phone?.trim() || "(11) 99999-9999",
        defaultDeliveryFee: Number(defaultDeliveryFee) || 8.0,
      });
    }

    // Generate or fetch integration API key
    const integration = await db.createOrUpdateStoreIntegration(store.id, {
      webhookUrl: webhookUrl?.trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Loja '${store.name}' conectada com sucesso à Central NovaesWeb Entregador!`,
      connection: {
        storeId: store.id,
        name: store.name,
        apiKey: integration.apiKeyHash,
        defaultDeliveryFee: store.defaultDeliveryFee,
        webhookUrl: store.webhookUrl || null,
        requiredHeaders: {
          "X-NovaesWeb-Store-Id": store.id,
          "X-NovaesWeb-API-Key": integration.apiKeyHash,
        },
      },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao conectar estabelecimento à central de entregas." },
      { status: 500 }
    );
  }
}
