import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_PASSWORD = "615210";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, storeCode } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Informe seu e-mail ou telefone cadastrado." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Digite sua senha de 6 dígitos." },
        { status: 400 }
      );
    }

    // Strict 6-digit password check: 615210
    if (password.trim() !== VALID_PASSWORD) {
      return NextResponse.json(
        { error: "Senha incorreta. A senha obrigatória é de 6 dígitos." },
        { status: 401 }
      );
    }

    const motoboy = await db.getMotoboy();
    let targetStore = null;

    // Se o entregador informou o Código da Loja (Convite do Lojista)
    if (storeCode && storeCode.trim()) {
      const cleanCode = storeCode.trim().toUpperCase();
      const linkResult = await db.validateAndLinkInvite(motoboy.id, cleanCode);

      if (!linkResult.success) {
        return NextResponse.json(
          { error: linkResult.error || "Código da loja inválido, expirado ou revogado." },
          { status: 400 }
        );
      }

      const store = await db.getStoreById(linkResult.link!.storeId);
      targetStore = store || {
        id: linkResult.link!.storeId,
        name: linkResult.link!.storeName,
        address: linkResult.link!.storeAddress,
      };
    } else {
      // Se não informou código, verifica se já tem lojas vinculadas
      const courierStores = await db.getCourierStores(motoboy.id);
      if (courierStores.length === 0) {
        return NextResponse.json(
          { error: "Informe o Código da Loja fornecido pelo lojista para acessar o painel." },
          { status: 400 }
        );
      }
      const existing = await db.getStoreById(courierStores[0].storeId);
      targetStore = existing || null;
    }

    return NextResponse.json({
      success: true,
      message: targetStore
        ? `Acesso autorizado ao painel de ${targetStore.name}!`
        : "Login realizado com sucesso!",
      motoboy: {
        id: motoboy.id,
        name: motoboy.name,
        email: motoboy.email,
        phone: motoboy.phone,
        vehicleModel: motoboy.vehicleModel,
        vehiclePlate: motoboy.vehiclePlate,
        rating: motoboy.rating,
      },
      store: targetStore,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar login." },
      { status: 500 }
    );
  }
}
