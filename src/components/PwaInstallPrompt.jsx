import React, { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(standaloneMode);
    if (standaloneMode) return;

    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem('tour_pwa_dismissed') === 'true') {
        return;
      }
    } catch {}

    // iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Delay prompt on iOS for smooth onboarding
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Android / Desktop Chrome beforeinstallprompt handler
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      sessionStorage.setItem('tour_pwa_dismissed', 'true');
    } catch {}
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm animate-bounce-subtle pointer-events-auto">
      <div className="p-4 rounded-2xl bg-zinc-950/90 dark:bg-zinc-900/95 border border-amber-500/30 text-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              🚌
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ติดตั้งแอปลงมือถือ
              </div>
              <div className="text-sm font-semibold text-white leading-tight">
                ทัวร์ 2026 (Full Screen)
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded-md hover:bg-zinc-800/60 transition-colors"
            aria-label="ปิดการแจ้งเตือน"
          >
            ✕
          </button>
        </div>

        {isIos ? (
          <div className="text-xs text-zinc-300 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <span>📲 วิธีติดตั้งบน iPhone (Safari):</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              1. แตะปุ่มแชร์ <span className="text-amber-300 font-bold">⎋ (Share)</span> ด้านล่างของ Safari<br />
              2. เลื่อนลงแล้วแตะ <span className="text-amber-300 font-bold">'เพิ่มไปยังหน้าจอโฮม ＋'</span>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 text-center cursor-pointer"
            >
              ติดตั้งบนหน้าจอโฮมทันที
            </button>
            <button
              onClick={handleDismiss}
              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              ไว้คราวหลัง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
