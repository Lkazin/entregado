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

  // 1. Clear session
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // 2. Put wrong password '000000'
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    for (const inp of inputs) {
      if (inp.placeholder && inp.placeholder.includes('Senha')) {
        inp.value = '000000';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  // Click Entrar
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Entrar')) {
        b.click();
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_login_wrong_password.png',
  });
  console.log('1. Wrong password error captured!');

  // 3. Put correct password '615210'
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    for (const inp of inputs) {
      if (inp.placeholder && inp.placeholder.includes('Senha')) {
        inp.value = '615210';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  // Click Entrar
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent && b.textContent.includes('Entrar')) {
        b.click();
      }
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({
    path: 'C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_home_clean_ready.png',
  });
  console.log('2. Clean production home captured!');

  await browser.close();
}

run().catch(console.error);
