const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function render() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = path.resolve(__dirname, 'tour_infographic_print.html');
  const pdfPath = path.resolve(__dirname, 'Tour_Event_App_Infographic.pdf');
  const pngPath = path.resolve(__dirname, 'Tour_Event_App_Infographic.png');
  const artifactPdfPath = 'C:\\Users\\Light\\.gemini\\antigravity\\brain\\31d5f008-21d9-406d-9b7c-77509486c6e5\\Tour_Event_App_Infographic.pdf';
  const artifactPngPath = 'C:\\Users\\Light\\.gemini\\antigravity\\brain\\31d5f008-21d9-406d-9b7c-77509486c6e5\\Tour_Event_App_Infographic.png';

  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  
  console.log('Loading HTML: ' + htmlPath);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to be fully loaded
  await page.evaluateHandle('document.fonts.ready');

  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '8mm', right: '8mm', bottom: '8mm', left: '8mm' }
  });

  console.log('Generating PNG screenshot...');
  // Hide the action bar for the screenshot
  await page.evaluate(() => {
    const bar = document.querySelector('.action-bar');
    if (bar) bar.style.display = 'none';
  });

  const pageElement = await page.$('.page');
  if (pageElement) {
    await pageElement.screenshot({ path: pngPath });
  } else {
    await page.screenshot({ path: pngPath, fullPage: true });
  }

  await browser.close();

  // Copy to artifact directory
  fs.copyFileSync(pdfPath, artifactPdfPath);
  fs.copyFileSync(pngPath, artifactPngPath);

  console.log('Done! PDF and PNG generated successfully.');
}

render().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
