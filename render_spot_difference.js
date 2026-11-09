import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const pngPath = path.resolve(__dirname, 'spot_the_difference_preview.png');
  const artifactPngPath = 'C:\\Users\\Light\\.gemini\\antigravity\\brain\\31d5f008-21d9-406d-9b7c-77509486c6e5\\spot_the_difference_preview.png';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1300, deviceScaleFactor: 1.5 });

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Click on "เกมจับผิดภาพ" tab
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.includes('เกมจับผิดภาพ')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: pngPath });
  await browser.close();

  fs.copyFileSync(pngPath, artifactPngPath);
  console.log('Spot the difference screenshot captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
