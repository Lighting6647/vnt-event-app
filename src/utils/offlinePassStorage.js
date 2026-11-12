/**
 * Offline Pass Storage & Network Health Sentinel
 * Tour & Event Management System (VNT Tour App)
 */

const STORAGE_PREFIX = 'tour_offline_pass_';
const LAST_ACTIVE_PASS_KEY = 'tour_last_active_pass_id';

/**
 * Cache participant profile and QR code data URL for offline access
 */
export function cachePassOffline(participant, qrDataUrl) {
  if (!participant || !participant.id) return;
  try {
    const payload = {
      participant,
      qrDataUrl,
      cachedAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    localStorage.setItem(STORAGE_PREFIX + participant.id.toUpperCase(), JSON.stringify(payload));
    localStorage.setItem(LAST_ACTIVE_PASS_KEY, participant.id.toUpperCase());
  } catch (e) {
    console.warn('Failed to cache pass offline:', e);
  }
}

/**
 * Retrieve cached pass for a specific participant ID
 */
export function getCachedPass(participantId) {
  if (!participantId) {
    try {
      participantId = localStorage.getItem(LAST_ACTIVE_PASS_KEY);
    } catch {}
  }
  if (!participantId) return null;

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + participantId.toUpperCase());
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.warn('Failed to parse cached pass:', e);
    return null;
  }
}

/**
 * Hook or helper to monitor online/offline network connectivity
 */
export function isBrowserOnline() {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true;
}
