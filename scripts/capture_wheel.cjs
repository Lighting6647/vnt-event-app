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
    await page.setViewport({ width: 1200, height: 1100, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3001/?tab=bus', { waitUntil: 'networkidle2' });
    
    // Find wheel card
    const cards = await page.$$('div.bg-white, div.dark\\:bg-zinc-900\\/90');
    let wheelCard = null;
    for (const card of cards) {
      const text = await page.evaluate(el => el.innerText, card);
      if (text.includes('วงล้อหมุนนำโชค')) {
        wheelCard = card;
        break;
      }
    }

    const target = wheelCard || await page.$('main');
    if (target) {
      const screenshotPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\ed2867ba-6d09-4aed-837e-fab44f268e44\\lucky_wheel_preview.png';
      await target.screenshot({ path: screenshotPath });
      console.log('Saved preview to:', screenshotPath);
    }

    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
