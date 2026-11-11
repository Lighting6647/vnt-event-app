const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    
    const fileUrl = 'file:///' + path.resolve('app_access_poster.html').replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Screenshot poster element
    const poster = await page.$('.poster-container');
    if (poster) {
      await poster.screenshot({
        path: 'app_access_poster.png',
        omitBackground: false
      });
      console.log('High-res poster screenshot saved: app_access_poster.png');
    }

    // Save A4 PDF
    await page.pdf({
      path: 'app_access_poster.pdf',
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    console.log('A4 PDF saved: app_access_poster.pdf');

    await browser.close();
  } catch (err) {
    console.error('Error generating poster:', err);
    process.exit(1);
  }
})();
