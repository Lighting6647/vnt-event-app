import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { playSuccess, playWarning, speakAnnouncement } from '../utils/soundEffects';

export default function StaffScanner({ participants, onClaimFood, onAddScore, onNavigateTab }) {
  const [mode, setMode] = useState('food'); // 'food' or 'score'
  const [pointsToAdd, setPointsToAdd] = useState(20);
  const [scanResult, setScanResult] = useState(null);
  const [manualId, setManualId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isCameraActive) {
        html5QrCodeRef.current.stop().catch(e => console.warn(e));
      }
    };
  }, [isCameraActive]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const qrReader = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = qrReader;

      await qrReader.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => handleProcessCode(decodedText),
        () => {}
      );
      setIsCameraActive(true);
    } catch (err) {
      console.error(err);
      setCameraError('ไม่สามารถเปิดกล้องได้ โปรดตรวจสอบสิทธิ์ หรือใช้การค้นหารหัสด้านล่าง');
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        setIsCameraActive(false);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleProcessCode = async (rawCode) => {
    let cleanId = rawCode.trim();

    // Support both smart URL (e.g. http://.../?user=TOUR-001) and plain ID (e.g. TOUR-001)
    if (cleanId.includes('?')) {
      try {
        const urlObj = new URL(cleanId);
        const u = urlObj.searchParams.get('user');
        if (u) cleanId = u;
      } catch {
        const match = cleanId.match(/user=([^&]+)/i);
        if (match) cleanId = match[1];
      }
    }
    cleanId = cleanId.toUpperCase();

    if (mode === 'food') {
      const res = await onClaimFood(cleanId);
      setScanResult(res);
      if (res.success) {
        playSuccess();
        if (voiceEnabled) {
          const personName = res.participant?.name || 'ผู้ร่วมงาน';
          speakAnnouncement(`สวัสดีคุณ ${personName} เชิญรับอาหารเช้าได้เลยค่ะ`);
        }
      } else {
        playWarning();
        if (voiceEnabled) {
          if (res.alreadyClaimed) {
            speakAnnouncement('ขออภัยค่ะ ท่านนี้ได้รับอาหารไปแล้วค่ะ');
          } else {
            speakAnnouncement('ไม่พบรหัสผู้ร่วมงานในระบบค่ะ');
          }
        }
      }
    } else {
      const res = await onAddScore(cleanId, pointsToAdd);
      setScanResult(res);
      if (res.success) {
        playSuccess();
        if (voiceEnabled) {
          speakAnnouncement(`บวกคะแนน ${pointsToAdd} แต้ม สำเร็จเรียบร้อยค่ะ`);
        }
      } else {
        playWarning();
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId) return;
    handleProcessCode(manualId);
    setManualId('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Apple Styled Segmented Control Header */}
      <div className="bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[28px] p-6 text-center space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div>
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
            STAFF OPERATIONS
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white mt-0.5">
            เครื่องมือสแกนเนอร์สำหรับพนักงาน
          </h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-1">
            สแกน QR ผ่านกล้องมือถือเพื่อจ่ายอาหาร (ล็อกกันรับซ้ำ) หรือสแกนเพิ่มคะแนนให้ทีมสี
          </p>
        </div>

        {/* Apple Segmented Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex p-1 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-black/[0.05] dark:border-white/[0.05]">
            <button
              onClick={() => { setMode('food'); setScanResult(null); }}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                mode === 'food'
                  ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-sm'
                  : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f]'
              }`}
            >
              🥪 1. สแกนแจกอาหาร
            </button>
            <button
              onClick={() => { setMode('score'); setScanResult(null); }}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                mode === 'score'
                  ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white shadow-sm'
                  : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f]'
              }`}
            >
              🏆 2. สแกนให้คะแนนทีม
            </button>
          </div>

          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              voiceEnabled
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <span>{voiceEnabled ? '🔊 เสียงประกาศเปิดอยู่' : '🔈 ปิดเสียงประกาศ'}</span>
          </button>
        </div>

        {/* Point Selector for Score Mode */}
        {mode === 'score' && (
          <div className="pt-2 flex items-center justify-center gap-2 border-t border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-[#86868b]">เลือกแต้มที่จะแจก:</span>
            {[10, 20, 30, 50, 100].map(pts => (
              <button
                key={pts}
                onClick={() => setPointsToAdd(pts)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  pointsToAdd === pts
                    ? 'bg-[#0071e3] text-white shadow-sm'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#a1a1a6]'
                }`}
              >
                +{pts}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Card Feedback */}
      {scanResult && (
        <div
          className={`p-5 rounded-[24px] border transition-all ${
            scanResult.success
              ? 'bg-[#34c759]/10 border-[#34c759]/30 text-[#1d1d1f] dark:text-white'
              : 'bg-[#ff3b30]/10 border-[#ff3b30]/30 text-[#1d1d1f] dark:text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-wider block ${
                scanResult.success ? 'text-[#34c759]' : 'text-[#ff3b30]'
              }`}>
                {scanResult.success ? '✓ ดำเนินการสำเร็จ' : '⚠️ แจ้งเตือนจากระบบ'}
              </span>
              <p className="text-sm font-semibold">{scanResult.message}</p>
              
              {scanResult.participant && (
                <div className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] pt-1">
                  ชื่อ: {scanResult.participant.name} | ทีม: {scanResult.participant.teamColor} | รถ: {scanResult.participant.busNumber}
                </div>
              )}

              {/* Quick Navigation Action Buttons after scan */}
              {onNavigateTab && scanResult.success && (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('leaderboard')}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors cursor-pointer"
                  >
                    🏆 ไปดูตารางคะแนน 10 สี
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('pass')}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-black/10 dark:bg-white/10 text-[#1d1d1f] dark:text-white hover:bg-black/15 transition-colors cursor-pointer"
                  >
                    🪪 ดูบัตรดิจิทัล
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setScanResult(null)}
              className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Camera Viewport */}
      <div className="bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white">
            กล้องสแกน QR Code
          </span>
          {isCameraActive ? (
            <button
              onClick={stopCamera}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/20"
            >
              ปิดกล้อง
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0071e3] text-white hover:bg-[#0077ed]"
            >
              เปิดกล้องสแกน
            </button>
          )}
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-[#f5f5f7] dark:bg-[#1d1d1f] min-h-[220px] flex items-center justify-center border border-black/[0.05] dark:border-white/[0.05]">
          <div id="qr-reader" className="w-full"></div>
          {!isCameraActive && (
            <div className="p-6 text-center text-[#86868b] text-xs space-y-1">
              <span className="text-3xl block">📷</span>
              <p>กดปุ่ม "เปิดกล้องสแกน" เพื่อเริ่มสแกนด้วยกล้องมือถือ</p>
              {cameraError && <p className="text-[#ff3b30] text-xs pt-1">{cameraError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Manual Search or Quick Click */}
      <div className="bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3">
        <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white block">
          หรือระบุรหัส / ชื่อผู้ร่วมงาน
        </span>

        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="พิมพ์รหัส เช่น TOUR-001..."
            className="flex-1 bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0071e3]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed]"
          >
            ตรวจสอบ
          </button>
        </form>

        {/* Quick Test Chips */}
        <div className="pt-2">
          <span className="text-[11px] text-[#86868b] block mb-2 font-medium">คลิกทดสอบด่วน:</span>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
            {participants.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProcessCode(p.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  p.foodClaimed
                    ? 'bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#86868b]'
                    : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-white hover:bg-[#0071e3] hover:text-white'
                }`}
              >
                {p.name} {p.foodClaimed ? '(รับแล้ว)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
