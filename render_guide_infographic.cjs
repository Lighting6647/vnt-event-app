const puppeteer = require('puppeteer-core');
const path = require('path');

async function renderInfographic() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = path.resolve(__dirname, 'tour_guide_infographic.html');
  const pngPath = path.resolve(__dirname, 'Tour_App_Guide_Infographic.png');
  const pdfPath = path.resolve(__dirname, 'Tour_App_Guide_Infographic.pdf');

  console.log('Launching Chrome to render Infographic PNG & PDF...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1697, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.evaluateHandle('document.fonts.ready');

  console.log('Taking high-res screenshot PNG...');
  const poster = await page.$('.poster-container');
  if (poster) {
    await poster.screenshot({ path: pngPath });
  } else {
    await page.screenshot({ path: pngPath, fullPage: true });
  }

  console.log('Generating A4 PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log('Infographic successfully created:');
  console.log('PNG:', pngPath);
  console.log('PDF:', pdfPath);
}

renderInfographic().catch(console.error);
