import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOUR_ROOT = path.join(__dirname, '..');

test('Feature 1: PWA Web App Manifest and iOS Mobile Meta Tags', () => {
  const manifestPath = path.join(TOUR_ROOT, 'public', 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public folder');

  const raw = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  assert.strictEqual(manifest.display, 'standalone', 'PWA display must be standalone');
  assert.ok(manifest.name.includes('ทัวร์'), 'PWA name must include ทัวร์');
  assert.ok(manifest.short_name, 'PWA must have short_name');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'PWA must declare app icons');

  const indexHtml = fs.readFileSync(path.join(TOUR_ROOT, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('rel="manifest"'), 'index.html must link to manifest');
  assert.ok(indexHtml.includes('apple-mobile-web-app-capable'), 'index.html must support iOS web app mode');
  assert.ok(indexHtml.includes('viewport-fit=cover'), 'index.html must support modern notched iPhone screens');
});

test('Feature 2: Screen Wake Lock API custom hook', async () => {
  const hookFile = path.join(TOUR_ROOT, 'src', 'utils', 'useWakeLock.js');
  assert.ok(fs.existsSync(hookFile), 'useWakeLock.js must exist');

  const hookCode = fs.readFileSync(hookFile, 'utf8');
  assert.ok(hookCode.includes("navigator.wakeLock.request('screen')"), 'Hook must request screen wake lock');
  assert.ok(hookCode.includes('visibilitychange'), 'Hook must handle visibilitychange for app backgrounding/resume');
  assert.ok(hookCode.includes('wakeLockRef.current.release()'), 'Hook must cleanly release lock on unmount');
});

test('Feature 3: Offline Pass Storage & Offline Resilience Sentinel', async () => {
  const offlineStorageFile = path.join(TOUR_ROOT, 'src', 'utils', 'offlinePassStorage.js');
  assert.ok(fs.existsSync(offlineStorageFile), 'offlinePassStorage.js must exist');

  // Dynamically import the module
  const { cachePassOffline, getCachedPass, isBrowserOnline } = await import('../src/utils/offlinePassStorage.js');
  assert.strictEqual(typeof cachePassOffline, 'function');
  assert.strictEqual(typeof getCachedPass, 'function');
  assert.strictEqual(typeof isBrowserOnline, 'function');

  // Mock localStorage for Node test environment
  const store = {};
  global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };

  const mockParticipant = { id: '500', name: 'อนันต์ เกษแก้ว', busNumber: 'รถบัสคันที่ 1' };
  const mockQr = 'data:image/png;base64,mockqrdata';

  cachePassOffline(mockParticipant, mockQr);
  const retrieved = getCachedPass('500');

  assert.ok(retrieved, 'Should retrieve cached pass');
  assert.strictEqual(retrieved.participant.name, 'อนันต์ เกษแก้ว');
  assert.strictEqual(retrieved.qrDataUrl, mockQr);
});

test('Component Verification: PwaInstallPrompt and DigitalPass UI integration', () => {
  const pwaPromptFile = path.join(TOUR_ROOT, 'src', 'components', 'PwaInstallPrompt.jsx');
  assert.ok(fs.existsSync(pwaPromptFile), 'PwaInstallPrompt component must exist');

  const pwaCode = fs.readFileSync(pwaPromptFile, 'utf8');
  assert.ok(pwaCode.includes('beforeinstallprompt'), 'PWA prompt must listen to install event');
  assert.ok(pwaCode.includes('วิธีติดตั้งบน iPhone'), 'PWA prompt must show iOS Safari guidance');

  const digitalPassCode = fs.readFileSync(path.join(TOUR_ROOT, 'src', 'components', 'DigitalPass.jsx'), 'utf8');
  assert.ok(digitalPassCode.includes('useWakeLock'), 'DigitalPass must use useWakeLock');
  assert.ok(digitalPassCode.includes('cachePassOffline'), 'DigitalPass must cache pass offline');
  assert.ok(digitalPassCode.includes('โหมดออฟไลน์'), 'DigitalPass must display offline status pill');
  assert.ok(digitalPassCode.includes('จอสว่างตลอด'), 'DigitalPass must display screen wake pill');
});
