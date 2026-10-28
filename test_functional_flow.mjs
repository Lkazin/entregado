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

  // 1. Screenshot of Real Login
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_1_login.png',
  });
  console.log('1. Login captured');

  // Click Entrar
  const entrarBtn = await page.$('button[type="button"]');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Entrar')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 2. Screenshot of Real Home
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_2_home.png',
  });
  console.log('2. Home captured');

  // Click Ver detalhes
  const buttonsHome = await page.$$('button');
  for (const b of buttonsHome) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Ver detalhes')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 3. Screenshot of Real Order Details
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_4_details.png',
  });
  console.log('3. Order Details captured');

  // Click Iniciar rota
  const buttonsDetails = await page.$$('button');
  for (const b of buttonsDetails) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Iniciar rota')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 4. Screenshot of Real Route Map
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_5_route.png',
  });
  console.log('4. Route Map captured');

  // Click Cheguei ao destino
  const buttonsRoute = await page.$$('button');
  for (const b of buttonsRoute) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Cheguei ao destino')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 5. Screenshot of Real Confirm Code
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_6_confirm.png',
  });
  console.log('5. Confirm Code captured');

  // Click Confirmar entrega
  const buttonsConfirm = await page.$$('button');
  for (const b of buttonsConfirm) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Confirmar entrega')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));

  // 6. Screenshot of Real Delivered Success
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_7_delivered.png',
  });
  console.log('6. Delivered Success captured');

  // Click Ver próximo pedido / Entregas
  const buttonsSuccess = await page.$$('button');
  for (const b of buttonsSuccess) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Ver próximo pedido')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 7. Screenshot of Real History
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/real_screen_8_history.png',
  });
  console.log('7. History captured');

  await browser.close();
  console.log('All functional flow screenshots captured successfully!');
}

run().catch(console.error);
