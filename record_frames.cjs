const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureVideoFrames() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const htmlPath = path.resolve(__dirname, 'tour_demo_video.html');
  const framesDir = path.resolve(__dirname, 'video_raw_frames');

  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('Launching Chrome to record HD frames...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  // Standard 1080p 16:9 ratio
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Stop auto-timer in page so we can control frames precisely
  await page.evaluate(() => {
    if (window.timer) clearInterval(window.timer);
    window.isPlaying = false;
  });

  // We have 5 chapters, each 6 seconds in the video = 30 seconds total
  // At 2 fps, that's 60 frames (lightweight, renders fast, clear slides)
  let frameIndex = 1;
  const fps = 2;
  const durationPerChapterSec = 6;
  const totalChapters = 5;

  for (let chap = 1; chap <= totalChapters; chap++) {
    console.log(`Rendering Chapter ${chap}...`);
    await page.evaluate((c) => {
      window.jumpToScene(c);
    }, chap);

    const totalFramesInChapter = durationPerChapterSec * fps;
    for (let f = 0; f < totalFramesInChapter; f++) {
      // Simulate progress scrubber
      const progressPercent = (((chap - 1) * durationPerChapterSec + (f / fps)) / (totalChapters * durationPerChapterSec)) * 100;
      await page.evaluate((pct) => {
        document.getElementById('progressBar').style.width = pct + '%';
      }, progressPercent);

      const frameName = `frame_${String(frameIndex).padStart(4, '0')}.png`;
      const framePath = path.join(framesDir, frameName);
      await page.screenshot({ path: framePath });
      frameIndex++;
    }
  }

  await browser.close();
  console.log(`Rendered ${frameIndex - 1} frames successfully into: ${framesDir}`);
}

captureVideoFrames().catch(console.error);
