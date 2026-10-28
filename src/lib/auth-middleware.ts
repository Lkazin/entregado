import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function validateStoreApiKey(request: Request): Promise<
  | { isValid: true; storeId: string; store: any }
  | { isValid: false; response: NextResponse }
> {
  const storeId =
    request.headers.get("x-novaesweb-store-id") ||
    request.headers.get("X-NovaesWeb-Store-Id");
  const apiKey =
    request.headers.get("x-novaesweb-api-key") ||
    request.headers.get("X-NovaesWeb-API-Key");

  if (!storeId || !apiKey) {
    return {
      isValid: false,
      response: NextResponse.json(
        {
          error: "Credenciais de integração não fornecidas nos headers.",
          requiredHeaders: ["X-NovaesWeb-Store-Id", "X-NovaesWeb-API-Key"],
        },
        { status: 401 }
      ),
    };
  }

  const isValid = await db.verifyStoreApiKey(storeId, apiKey);
  if (!isValid) {
    return {
      isValid: false,
      response: NextResponse.json(
        {
          error: "Chave de integração inválida ou loja não autorizada.",
          storeId,
        },
        { status: 403 }
      ),
    };
  }

  const store = await db.getStoreById(storeId);
  return {
    isValid: true,
    storeId,
    store,
  };
}
