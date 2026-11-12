const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' });

  // 1. Open Admin modal and unlock with default passcode 2026
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminBtn = btns.find((b) => b.innerText.includes('ผู้ดูแลระบบ') || b.innerText === 'Admin');
    if (adminBtn) adminBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.type('input[type="password"]', '2026');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 600));

  // 2. Click 'สแกนเนอร์ QR สตาฟฟ์'
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scannerTab = btns.find((b) => b.innerText.includes('สแกนเนอร์ QR สตาฟฟ์'));
    if (scannerTab) scannerTab.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 3. Switch to Mode 2: '🏆 2. สแกนให้คะแนนทีม'
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scoreModeBtn = btns.find((b) => b.innerText.includes('สแกนให้คะแนนทีม'));
    if (scoreModeBtn) scoreModeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // 4. Select +100 points
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p100 = btns.find((b) => b.innerText === '+100');
    if (p100) p100.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // 5. Test manual code submission for user 500
  const input = await page.$('input[placeholder*="TOUR-001"]');
  if (input) {
    await input.type('500');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText === 'ตรวจสอบ');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
  }

  // 6. Check Result Card
  const resultText = await page.evaluate(() => {
    const resultBox = document.querySelector('.bg-\\[\\#34c759\\]\\/10, .bg-\\[\\#ff3b30\\]\\/10');
    return resultBox ? resultBox.innerText : 'NO_RESULT_BOX';
  });
  console.log('Result card text:\n', resultText);

  const isSuccessScore = resultText.includes('เพิ่มคะแนนสำเร็จ (+100 แต้ม)');
  const isFoodClaimedBug = resultText.includes('ได้รับอาหารไปแล้ว');
  console.log('1. Score added successfully (+100):', isSuccessScore);
  console.log('2. Bug reproduced (said food claimed):', isFoodClaimedBug);

  // Take screenshot of scanner with score added
  await page.screenshot({ path: 'C:/Users/User/.gemini/antigravity/brain/ed2867ba-6d09-4aed-837e-fab44f268e44/scanner_score_success.png' });

  // 7. Now switch back to Mode 1: '🥪 1. สแกนแจกอาหาร'
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const foodModeBtn = btns.find((b) => b.innerText.includes('สแกนแจกอาหาร'));
    if (foodModeBtn) foodModeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // Type 500 again in Food mode
  const input2 = await page.$('input[placeholder*="TOUR-001"]');
  if (input2) {
    await input2.type('500');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText === 'ตรวจสอบ');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
  }

  const resultFood = await page.evaluate(() => {
    const resultBox = document.querySelector('.bg-\\[\\#34c759\\]\\/10, .bg-\\[\\#ff3b30\\]\\/10');
    return resultBox ? resultBox.innerText : 'NO_RESULT_BOX';
  });
  console.log('Food scan result:\n', resultFood);

  console.log('Total page errors:', errors.length);
  await browser.close();
})();
