import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderShowcase() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = path.resolve(__dirname, 'design_showcase.html');
  const pngPath = path.resolve(__dirname, 'design_5_styles_preview.png');
  const artifactPngPath = 'C:\\Users\\Light\\.gemini\\antigravity\\brain\\31d5f008-21d9-406d-9b7c-77509486c6e5\\design_5_styles_preview.png';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 2600, deviceScaleFactor: 1.5 });
  
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();

  fs.copyFileSync(pngPath, artifactPngPath);
  console.log('Design showcase image rendered successfully!');
}

renderShowcase().catch(err => {
  console.error('Error rendering showcase image:', err);
  process.exit(1);
});
