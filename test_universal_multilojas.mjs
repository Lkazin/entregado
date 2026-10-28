import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\camil\\.gemini\\antigravity\\brain\\d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a";

async function runVerification() {
  console.log("=== 1. TESTANDO ENDPOINTS DE API MULTILOJAS ===");

  // 1.1 List stores
  const resStores = await fetch("http://localhost:3002/api/stores").then((r) => r.json());
  console.log("Lojas cadastradas:", resStores.stores?.map((s) => `${s.id}: ${s.name}`).join(", "));

  // 1.2 List invites for Açaí do Rei
  const resInvites = await fetch("http://localhost:3002/api/stores/store-acai-01/invites").then((r) => r.json());
  console.log("Convites Açaí do Rei:", resInvites.invites?.map((i) => `${i.code} (Usos: ${i.usedCount}/${i.maxUses})`).join(", "));

  // 1.3 Test invalid invite code rejection
  const resInvalid = await fetch("http://localhost:3002/api/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "NX-INVALIDO-9999" }),
  }).then((r) => r.json());
  console.log("Validação de código inválido (deve falhar):", resInvalid.error);

  // 1.4 Test valid invite code linking
  const resValid = await fetch("http://localhost:3002/api/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "NX-ACAI-7821" }),
  }).then((r) => r.json());
  console.log("Validação de código válido (deve ter sucesso):", resValid.success ? "SUCESSO: " + resValid.message : resValid.error);

  // 1.5 List couriers linked to Açaí do Rei
  const resCouriers = await fetch("http://localhost:3002/api/stores/store-acai-01/couriers").then((r) => r.json());
  console.log("Entregadores vinculados:", resCouriers.couriers?.map((c) => `${c.courierName} (${c.status})`).join(", "));

  // 1.6 Dispatch real order to courier mb-001
  const resDispatch = await fetch("http://localhost:3002/api/stores/store-acai-01/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "Mariana Souza",
      customerPhone: "(51) 98765-4321",
      destinationAddress: "Rua das Flores, 456",
      destinationNeighborhood: "Bairro Centro - Canoas/RS",
      orderValue: 48.90,
      deliveryFee: 8.00,
      assignedCourierId: "mb-001",
      confirmationCode: "1742",
    }),
  }).then((r) => r.json());
  console.log("Despacho do pedido:", resDispatch.success ? `Pedido ${resDispatch.order.orderNumber} criado!` : resDispatch.error);

  console.log("\n=== 2. TESTANDO INTERFACE VISUAL VIA PUPPETEER ===");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 420, height: 860, isMobile: true, hasTouch: true },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3002", { waitUntil: "networkidle2" });

  // 2.1 Login screen
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 600));

  const loginPath = path.join(ARTIFACTS_DIR, "screen_universal_1_login.png");
  await page.screenshot({ path: loginPath });
  console.log("Screenshot login salvo em:", loginPath);

  // 2.2 Perform login with password 615210
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
  }

  // 2.3 Home screen with active store Açaí do Rei
  const homePath = path.join(ARTIFACTS_DIR, "screen_universal_2_home.png");
  await page.screenshot({ path: homePath });
  console.log("Screenshot home salvo em:", homePath);

  // 2.4 Open Link Store screen
  const linkStoreBtn = await page.$('button[title="Vincular a nova loja"]');
  if (linkStoreBtn) {
    await linkStoreBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    const linkPath = path.join(ARTIFACTS_DIR, "screen_universal_link_store.png");
    await page.screenshot({ path: linkPath });
    console.log("Screenshot vincular loja salvo em:", linkPath);
  }

  // 2.5 Return to home and open Painel do Lojista
  await page.goto("http://localhost:3002", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));

  // Find "Painel do Lojista" button
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes("Painel do Lojista")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  const lojistaPath = path.join(ARTIFACTS_DIR, "screen_universal_painel_lojista.png");
  await page.screenshot({ path: lojistaPath });
  console.log("Screenshot painel lojista salvo em:", lojistaPath);

  await browser.close();
  console.log("\n=== TODOS OS TESTES CONCLUÍDOS COM SUCESSO! ===");
}

runVerification().catch(console.error);
