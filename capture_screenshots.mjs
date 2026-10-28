import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1200, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' });

  // 1. Click Part 1 (Passos 1 ao 4)
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Passos 1 ao 4')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screenshot_part1.png',
    fullPage: false
  });

  // 2. Click Part 2 (Passos 5 ao 8)
  const buttons2 = await page.$$('button');
  for (const btn of buttons2) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Passos 5 ao 8')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screenshot_part2.png',
    fullPage: false
  });

  // 3. Simulator View
  for (const btn of buttons2) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Simulador Interativo')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screenshot_simulator.png',
    fullPage: false
  });

  // 4. Mobile Standalone View (/app)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:3002/app', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await mobilePage.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screenshot_mobile_app.png',
    fullPage: false
  });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
