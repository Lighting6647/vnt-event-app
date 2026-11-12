import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useWakeLock Hook
 * Automatically keeps the smartphone display on/active while viewing critical screens (e.g. Digital Pass)
 */
export function useWakeLock(enabled = true) {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'wakeLock' in navigator);
  }, []);

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    try {
      if (!wakeLockRef.current || wakeLockRef.current.released) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setIsLocked(true);

        wakeLockRef.current.addEventListener('release', () => {
          setIsLocked(false);
        });
      }
    } catch (err) {
      // Typically AbortError or NotAllowedError if low battery / hidden tab
      setIsLocked(false);
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (wakeLockRef.current && !wakeLockRef.current.released) {
      try {
        await wakeLockRef.current.release();
      } catch {}
      wakeLockRef.current = null;
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (enabled && isSupported) {
      requestLock();

      // Re-acquire lock if user switches back to tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && enabled) {
          requestLock();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        releaseLock();
      };
    } else {
      releaseLock();
    }
  }, [enabled, isSupported, requestLock, releaseLock]);

  return { isLocked, isSupported, requestLock, releaseLock };
}
