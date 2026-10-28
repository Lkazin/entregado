import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1200 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

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
    path: 'C:/Users/camil/.gemini/antigravity/brain/2842dae5-1e01-43dc-8daa-1027abc1526f/screenshot_part1.png',
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
    path: 'C:/Users/camil/.gemini/antigravity/brain/2842dae5-1e01-43dc-8daa-1027abc1526f/screenshot_part2.png',
    fullPage: false
  });

  await browser.close();
  console.log('Part 1 and Part 2 screenshots captured!');
}

run().catch(console.error);
