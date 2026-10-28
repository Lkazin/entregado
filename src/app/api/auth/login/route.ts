import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_PASSWORD = "615210";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Informe seu e-mail ou telefone cadastrado" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Digite sua senha de 6 dígitos" },
        { status: 400 }
      );
    }

    // Strict 6-digit password check: 615210
    if (password.trim() !== VALID_PASSWORD) {
      return NextResponse.json(
        { error: "Senha incorreta. Digite a senha correta de 6 dígitos." },
        { status: 401 }
      );
    }

    const motoboy = await db.getMotoboy();

    return NextResponse.json({
      success: true,
      motoboy: {
        id: motoboy.id,
        name: motoboy.name,
        email: motoboy.email,
        phone: motoboy.phone,
        vehicleModel: motoboy.vehicleModel,
        vehiclePlate: motoboy.vehiclePlate,
        rating: motoboy.rating,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar login" },
      { status: 500 }
    );
  }
}
