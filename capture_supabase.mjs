import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' });

  // Login
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Entrar')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_supabase_connected.png',
  });
  console.log('Supabase connected screenshot captured!');

  await browser.close();
}

run().catch(console.error);
