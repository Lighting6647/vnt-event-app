const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureDemoFrames() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = path.resolve(__dirname, 'tour_demo_video.html');
  const outputDir = path.resolve(__dirname, 'video_preview_frames');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching Chrome to capture video chapters...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Chapter 1 to 5 screenshots
  for (let i = 1; i <= 5; i++) {
    console.log(`Capturing Chapter ${i}...`);
    await page.evaluate((sceneNum) => {
      window.jumpToScene(sceneNum);
    }, i);

    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(outputDir, `chapter_${i}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved: ${shotPath}`);
  }

  // Also capture the main video player canvas as full preview
  const mainPreview = path.resolve(__dirname, 'tour_demo_video_cover.png');
  await page.screenshot({ path: mainPreview });
  console.log(`Saved Cover: ${mainPreview}`);

  await browser.close();
  console.log('Done capturing all demo video frames.');
}

captureDemoFrames().catch(console.error);
