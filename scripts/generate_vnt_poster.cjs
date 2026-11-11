const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    
    // 1. Render vnt.tour/konix poster
    const fileUrl = 'file:///' + path.resolve('app_access_poster_vnt_tour.html').replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    const card = await page.$('.standee-card');
    if (card) {
      await card.screenshot({
        path: 'app_access_poster_vnt_tour.png',
        omitBackground: false
      });
      console.log('High-res poster screenshot saved: app_access_poster_vnt_tour.png');
    }

    await page.pdf({
      path: 'app_access_poster_vnt_tour.pdf',
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    console.log('A4 PDF saved: app_access_poster_vnt_tour.pdf');

    await browser.close();

    // Copy to artifact directory
    const artifactDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed2867ba-6d09-4aed-837e-fab44f268e44';
    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync('app_access_poster_vnt_tour.png', path.join(artifactDir, 'app_access_poster_vnt_tour.png'));
      console.log('Copied to artifact directory!');
    }
  } catch (err) {
    console.error('Error generating poster:', err);
    process.exit(1);
  }
})();
