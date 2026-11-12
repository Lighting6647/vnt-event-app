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

  // 1. Click Admin button in Navbar to open modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminBtn = btns.find((b) => b.innerText.includes('ผู้ดูแลระบบ') || b.innerText === 'Admin');
    if (adminBtn) adminBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Submit password '2026' in modal
  await page.type('input[type="password"]', '2026');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 600));

  // 2. Check if Admin Panel is unlocked
  const isUnlocked = await page.evaluate(() => document.body.innerText.includes('ศูนย์จัดการระบบสำหรับทีมงาน'));
  console.log('1. Admin unlocked:', isUnlocked);

  // 3. Click 'ตั้งค่าระบบ & รหัสผ่าน'
  const clickedSettings = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('ตั้งค่าระบบ'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('2. Clicked Settings Tab:', clickedSettings);
  await new Promise((r) => setTimeout(r, 500));

  // 4. Verify Settings view text
  const hasPasscodeManager = await page.evaluate(() => document.body.innerText.includes('จัดการรหัสผ่านแอดมิน'));
  const hasExportHub = await page.evaluate(() => document.body.innerText.includes('ศูนย์ส่งออกรายงาน'));
  console.log('3. Has Passcode Manager:', hasPasscodeManager, '| Has Export Hub:', hasExportHub);

  // 5. Test setting custom passcode '8899'
  const inputs = await page.$$('input[type="password"]');
  console.log('4. Password inputs found in Settings:', inputs.length);
  if (inputs.length >= 2) {
    await inputs[0].type('8899');
    await inputs[1].type('8899');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('บันทึกรหัสผ่านใหม่'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
  }
  const customActive = await page.evaluate(() => document.body.innerText.includes('ใช้รหัสผ่านกำหนดเอง (Active)'));
  console.log('5. Custom passcode active badge:', customActive);

  // Take screenshot of Settings page
  await page.screenshot({ path: 'C:/Users/User/.gemini/antigravity/brain/ed2867ba-6d09-4aed-837e-fab44f268e44/admin_settings_preview.png' });

  // 6. Test locking and unlocking with '8899'
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('ล็อคโหมดผู้ดูแล'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Re-open Admin modal
  const reopened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminBtn = btns.find((b) => b.innerText.includes('ผู้ดูแลระบบ') || b.innerText === 'Admin');
    if (adminBtn) {
      adminBtn.click();
      return true;
    }
    return false;
  });
  console.log('Reopened Admin modal:', reopened);
  await new Promise((r) => setTimeout(r, 600));

  const modalVisible = await page.evaluate(() => !!document.querySelector('input[type="password"]'));
  console.log('Modal password input visible:', modalVisible);

  // Now unlock with '8899'
  await page.type('input[type="password"]', '8899');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1000));

  const pageText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Page text after unlock:', pageText);

  const unlockedWithNewCode = await page.evaluate(() => document.body.innerText.includes('ศูนย์จัดการระบบสำหรับทีมงาน'));
  console.log('6. Successfully unlocked with new passcode 8899:', unlockedWithNewCode);

  console.log('7. Errors count:', errors.length);
  await browser.close();
})();
