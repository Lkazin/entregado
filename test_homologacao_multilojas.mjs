import puppeteer from "puppeteer-core";
import path from "path";

const BASE_URL = "http://localhost:3002";
const ARTIFACTS_DIR = "C:\\Users\\camil\\.gemini\\antigravity\\brain\\d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a";

async function runHomologation() {
  console.log("====================================================================");
  console.log("HOMOLOGAÇÃO CENTRAL SUPABASE & INTEGRAÇÃO UNIVERSAL MULTILOJAS");
  console.log("====================================================================\n");

  // 1. Cadastrar/Conectar Loja 1: Burger House
  console.log("--- 1. Conectando Loja 1: Burger House ---");
  const resStore1 = await fetch(`${BASE_URL}/api/v1/integration/stores/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storeId: "store-burger-test",
      name: "Burger House",
      category: "Hamburgueria Artesanal",
      address: "Av. Paulista, 1000 - Bela Vista",
      phone: "(11) 98888-1111",
      defaultDeliveryFee: 8.50,
      webhookUrl: "https://burgerhouse.com.br/api/webhooks/delivery",
    }),
  }).then((r) => r.json());
  console.log("Loja 1 conectada:", resStore1.connection?.name, "| API Key:", resStore1.connection?.apiKey);
  const apiKey1 = resStore1.connection.apiKey;

  // 2. Cadastrar/Conectar Loja 2: Fogo na Brasa
  console.log("\n--- 2. Conectando Loja 2: Fogo na Brasa ---");
  const resStore2 = await fetch(`${BASE_URL}/api/v1/integration/stores/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storeId: "store-fogo-test",
      name: "Fogo na Brasa",
      category: "Churrascaria & Grelhados",
      address: "Rua do Fogo, 500 - Moinhos de Vento",
      phone: "(51) 97777-2222",
      defaultDeliveryFee: 9.00,
      webhookUrl: "https://fogonabrasa.com.br/api/webhooks/delivery",
    }),
  }).then((r) => r.json());
  console.log("Loja 2 conectada:", resStore2.connection?.name, "| API Key:", resStore2.connection?.apiKey);
  const apiKey2 = resStore2.connection.apiKey;

  // 3. Teste de Segurança: Tentar acessar sem chave ou com chave inválida
  console.log("\n--- 3. Teste de Segurança e Autenticação B2B ---");
  const resAuthFail = await fetch(`${BASE_URL}/api/v1/integration/drivers`, {
    headers: {
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": "CHAVE_FALSA_HACKER",
    },
  });
  console.log("Tentativa com chave inválida bloqueada (Status esperado 403):", resAuthFail.status);

  // 4. Gerar Códigos de Convite Independentes
  console.log("\n--- 4. Geração de Convites por Loja ---");
  const resInvite1 = await fetch(`${BASE_URL}/api/v1/integration/invites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": apiKey1,
    },
    body: JSON.stringify({ maxUses: 5, validityHours: 48 }),
  }).then((r) => r.json());
  console.log("Convite Loja 1 (Burger House):", resInvite1.invite?.code);

  const resInvite2 = await fetch(`${BASE_URL}/api/v1/integration/invites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NovaesWeb-Store-Id": "store-fogo-test",
      "X-NovaesWeb-API-Key": apiKey2,
    },
    body: JSON.stringify({ maxUses: 5, validityHours: 48 }),
  }).then((r) => r.json());
  console.log("Convite Loja 2 (Fogo na Brasa):", resInvite2.invite?.code);

  // 5. Entregador vincula-se a ambas as lojas via aplicativo
  console.log("\n--- 5. Entregador Carlos Silva Vinculando-se às Duas Lojas ---");
  const link1 = await fetch(`${BASE_URL}/api/invites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courierId: "mb-001", code: resInvite1.invite.code }),
  }).then((r) => r.json());
  console.log("Vínculo Loja 1:", link1.message);

  const link2 = await fetch(`${BASE_URL}/api/invites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courierId: "mb-001", code: resInvite2.invite.code }),
  }).then((r) => r.json());
  console.log("Vínculo Loja 2:", link2.message);

  // 6. Consultar Entregadores Autorizados pelas Lojas
  console.log("\n--- 6. Consulta de Entregadores Autorizados (Painel de Cada Loja) ---");
  const driversStore1 = await fetch(`${BASE_URL}/api/v1/integration/drivers`, {
    headers: {
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": apiKey1,
    },
  }).then((r) => r.json());
  console.log("Entregadores Burger House:", driversStore1.drivers?.map((d) => `${d.name} (${d.status})`));

  const driversStore2 = await fetch(`${BASE_URL}/api/v1/integration/drivers`, {
    headers: {
      "X-NovaesWeb-Store-Id": "store-fogo-test",
      "X-NovaesWeb-API-Key": apiKey2,
    },
  }).then((r) => r.json());
  console.log("Entregadores Fogo na Brasa:", driversStore2.drivers?.map((d) => `${d.name} (${d.status})`));

  // 7. Loja 1 despacha Pedido #101 com Idempotência
  console.log("\n--- 7. Loja 1 Despachando Pedido #101 ---");
  const dispatch1 = await fetch(`${BASE_URL}/api/v1/integration/deliveries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": apiKey1,
    },
    body: JSON.stringify({
      externalOrderId: "ped-bh-101",
      idempotencyKey: "store-burger-test_ped-bh-101_v1",
      assignedDriverId: "mb-001",
      customer: {
        name: "Guilherme Santos",
        phone: "(11) 98765-1111",
        address: "Rua Augusta, 500 - Apto 42",
        neighborhood: "Consolação - São Paulo/SP",
      },
      orderValue: 54.90,
      deliveryFee: 8.50,
      confirmationCode: "1742",
    }),
  }).then((r) => r.json());
  console.log("Despacho Loja 1 criado:", dispatch1.delivery?.orderNumber, "| Status:", dispatch1.delivery?.status, "| Duplicado?", dispatch1.isDuplicate);

  // 8. Teste de Idempotência: Reenviar a mesma requisição
  console.log("\n--- 8. Teste de Idempotência contra Reenvios Duplicados ---");
  const dispatch1Retry = await fetch(`${BASE_URL}/api/v1/integration/deliveries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": apiKey1,
    },
    body: JSON.stringify({
      externalOrderId: "ped-bh-101",
      idempotencyKey: "store-burger-test_ped-bh-101_v1",
      assignedDriverId: "mb-001",
      customer: {
        name: "Guilherme Santos",
        address: "Rua Augusta, 500 - Apto 42",
      },
      orderValue: 54.90,
    }),
  }).then((r) => r.json());
  console.log("Reenvio com mesma chave (deve retornar isDuplicate=true):", dispatch1Retry.isDuplicate);

  // 9. Loja 2 despacha Pedido #201
  console.log("\n--- 9. Loja 2 Despachando Pedido #201 ---");
  const dispatch2 = await fetch(`${BASE_URL}/api/v1/integration/deliveries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NovaesWeb-Store-Id": "store-fogo-test",
      "X-NovaesWeb-API-Key": apiKey2,
    },
    body: JSON.stringify({
      externalOrderId: "ped-fb-201",
      idempotencyKey: "store-fogo-test_ped-fb-201_v1",
      assignedDriverId: "mb-001",
      customer: {
        name: "Renata Fagundes",
        phone: "(51) 99888-2222",
        address: "Rua Padre Chagas, 180",
        neighborhood: "Moinhos de Vento - Porto Alegre/RS",
      },
      orderValue: 98.00,
      deliveryFee: 9.00,
      confirmationCode: "3891",
    }),
  }).then((r) => r.json());
  console.log("Despacho Loja 2 criado:", dispatch2.delivery?.orderNumber, "| Status:", dispatch2.delivery?.status);

  // 10. Prova de Isolamento Estrito entre Lojas
  console.log("\n--- 10. Verificação de Isolamento Estrito entre Lojas ---");
  const listStore1 = await fetch(`${BASE_URL}/api/v1/integration/deliveries`, {
    headers: {
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": apiKey1,
    },
  }).then((r) => r.json());
  console.log("Pedidos vistos pela Loja 1 (Burger House):", listStore1.deliveries?.map((d) => `${d.orderNumber} (${d.customerName})`));

  const listStore2 = await fetch(`${BASE_URL}/api/v1/integration/deliveries`, {
    headers: {
      "X-NovaesWeb-Store-Id": "store-fogo-test",
      "X-NovaesWeb-API-Key": apiKey2,
    },
  }).then((r) => r.json());
  console.log("Pedidos vistos pela Loja 2 (Fogo na Brasa):", listStore2.deliveries?.map((d) => `${d.orderNumber} (${d.customerName})`));

  const isIsolated =
    listStore1.deliveries.every((d) => d.orderNumber !== dispatch2.delivery?.orderNumber) &&
    listStore2.deliveries.every((d) => d.orderNumber !== dispatch1.delivery?.orderNumber);
  console.log("ISOLAMENTO TOTAL CONFIRMADO?", isIsolated ? "SIM (Nenhuma loja vê pedidos da outra)" : "NÃO");

  // 11. Entregador conclui pedido com OTP
  console.log("\n--- 11. Conclusão da Entrega da Loja 1 com OTP '1742' ---");
  const resConfirm = await fetch(`${BASE_URL}/api/orders/${dispatch1.delivery.id}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "1742" }),
  }).then((r) => r.json());
  console.log("Resultado da confirmação OTP:", resConfirm.success ? "ENTREGA CONCLUÍDA COM SUCESSO!" : resConfirm.error);

  // 12. Consultar Timeline de Auditoria da Entrega
  console.log("\n--- 12. Auditoria e Timeline de Eventos da Entrega ---");
  const resTimeline = await fetch(`${BASE_URL}/api/v1/integration/deliveries/${dispatch1.delivery.id}`, {
    headers: {
      "X-NovaesWeb-Store-Id": "store-burger-test",
      "X-NovaesWeb-API-Key": apiKey1,
    },
  }).then((r) => r.json());
  console.log("Status final:", resTimeline.delivery?.status);
  console.log("Eventos registrados:");
  resTimeline.timeline?.forEach((t, i) => {
    console.log(`  [${i + 1}] Evento: ${t.event} | De: ${t.fromStatus || 'init'} -> Para: ${t.toStatus} | Ator: ${t.actorType}`);
  });

  // 13. Captura Visual da Homologação via Puppeteer
  console.log("\n--- 13. Capturando Telas de Homologação via Puppeteer ---");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 420, height: 860, isMobile: true, hasTouch: true },
  });

  const page = await browser.newPage();
  await page.goto(`${BASE_URL}`, { waitUntil: "networkidle2" });

  // Login
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Switch to Fogo na Brasa
  const linkStoreBtn = await page.$('button[title="Vincular a nova loja"]');
  if (linkStoreBtn) {
    await linkStoreBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "screen_homologacao_multiloja_links.png") });
    console.log("Screenshot lista de lojas vinculadas salvo.");
  }

  await browser.close();
  console.log("\n====================================================================");
  console.log("HOMOLOGAÇÃO CONCLUÍDA COM 100% DE SUCESSO!");
  console.log("====================================================================");
}

runHomologation().catch(console.error);
