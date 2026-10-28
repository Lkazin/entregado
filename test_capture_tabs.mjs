import puppeteer from "puppeteer-core";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\camil\\.gemini\\antigravity\\brain\\d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 420, height: 860, isMobile: true, hasTouch: true },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3002", { waitUntil: "networkidle2" });

  // Open Painel do Lojista
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes("Painel do Lojista")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // Click on "Códigos Convite"
  const tabButtons = await page.$$("button");
  for (const b of tabButtons) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes("Códigos Convite")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "screen_universal_lojista_convites.png") });

  // Click on "Despachar"
  const tabButtons2 = await page.$$("button");
  for (const b of tabButtons2) {
    const text = await page.evaluate((el) => el.innerText, b);
    if (text && text.includes("Despachar")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "screen_universal_lojista_despacho.png") });

  await browser.close();
  console.log("Abas do painel capturadas com sucesso!");
}

run().catch(console.error);
