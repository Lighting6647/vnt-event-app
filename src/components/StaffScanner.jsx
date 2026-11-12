import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { playSuccess, playWarning, speakAnnouncement } from '../utils/soundEffects';
import { TEAM_COLORS } from '../utils/mockData';

export default function StaffScanner({ participants, onClaimFood, onAddScore, onNavigateTab }) {
  const [mode, setMode] = useState('food'); // 'food' or 'score'
  const [pointsToAdd, setPointsToAdd] = useState(20);
  const [scanResult, setScanResult] = useState(null);
  const [manualId, setManualId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const html5QrCodeRef = useRef(null);

  // Synchronized state refs to eliminate stale closure bugs in Html5Qrcode callbacks
  const modeRef = useRef(mode);
  const pointsToAddRef = useRef(pointsToAdd);
  const voiceEnabledRef = useRef(voiceEnabled);
  const onClaimFoodRef = useRef(onClaimFood);
  const onAddScoreRef = useRef(onAddScore);
  const handleProcessCodeRef = useRef(null);

  // Scan cooldown & anti-spam guards
  const isScanningLockedRef = useRef(false);
  const lastScannedCodeRef = useRef('');
  const lastScannedTimeRef = useRef(0);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { pointsToAddRef.current = pointsToAdd; }, [pointsToAdd]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { onClaimFoodRef.current = onClaimFood; }, [onClaimFood]);
  useEffect(() => { onAddScoreRef.current = onAddScore; }, [onAddScore]);

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
        (decodedText) => {
          if (handleProcessCodeRef.current) {
            handleProcessCodeRef.current(decodedText);
          }
        },
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
    if (!rawCode) return;
    let cleanId = String(rawCode).trim();

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

    // Anti-spam debounce guard: prevent duplicate scans within 2.5s
    const now = Date.now();
    if (isScanningLockedRef.current) return;
    if (lastScannedCodeRef.current === cleanId && now - lastScannedTimeRef.current < 2500) {
      return;
    }

    isScanningLockedRef.current = true;
    lastScannedCodeRef.current = cleanId;
    lastScannedTimeRef.current = now;

    try {
      const activeMode = modeRef.current;
      const activePoints = pointsToAddRef.current;
      const activeVoice = voiceEnabledRef.current;

      if (activeMode === 'food') {
        const res = await onClaimFoodRef.current(cleanId);
        setScanResult({ ...res, scanMode: 'food' });
        if (res.success) {
          playSuccess();
          if (activeVoice) {
            const personName = res.participant?.name || 'ผู้ร่วมงาน';
            speakAnnouncement(`สวัสดีคุณ ${personName} เชิญรับอาหารเช้าได้เลยค่ะ`);
          }
        } else {
          playWarning();
          if (activeVoice) {
            if (res.alreadyClaimed) {
              const personName = res.participant?.name || 'ท่านนี้';
              speakAnnouncement(`ขออภัยค่ะ คุณ ${personName} ได้รับอาหารไปแล้วค่ะ`);
            } else {
              speakAnnouncement('ไม่พบรหัสผู้ร่วมงานในระบบค่ะ');
            }
          }
        }
      } else {
        // Active mode: 'score'
        const res = await onAddScoreRef.current(cleanId, activePoints);
        setScanResult({ ...res, scanMode: 'score', pointsAdded: activePoints });
        if (res.success) {
          playSuccess();
          if (activeVoice) {
            const personName = res.participant?.name || cleanId;
            const team = TEAM_COLORS.find(t => t.id === res.participant?.teamColor);
            const teamLabel = team ? team.name : (res.participant?.teamColor || '');
            speakAnnouncement(`เพิ่มคะแนน ${activePoints} แต้ม ให้คุณ ${personName} ${teamLabel} เรียบร้อยแล้วค่ะ`);
          }
        } else {
          playWarning();
          if (activeVoice) {
            speakAnnouncement('ไม่พบรหัสผู้ร่วมงานในระบบค่ะ');
          }
        }
      }
    } finally {
      setTimeout(() => {
        isScanningLockedRef.current = false;
      }, 800);
    }
  };

  handleProcessCodeRef.current = handleProcessCode;

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
                {scanResult.success
                  ? (scanResult.scanMode === 'score'
                      ? `✓ เพิ่มคะแนนสำเร็จ (+${scanResult.pointsAdded || pointsToAdd} แต้ม)`
                      : '✓ บันทึกการรับอาหารเช้าสำเร็จ')
                  : (scanResult.scanMode === 'score'
                      ? '⚠️ แจ้งเตือน: ไม่พบรหัสผู้ร่วมงาน'
                      : '⚠️ แจ้งเตือนจากระบบ (รับอาหารแล้ว)')}
              </span>
              <p className="text-sm font-semibold">{scanResult.message}</p>
              
              {scanResult.participant && (
                <div className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] pt-1">
                  ชื่อ: <strong className="text-zinc-900 dark:text-zinc-100">{scanResult.participant?.name || 'ไม่ระบุชื่อ'}</strong> | ทีม: <span className="font-bold">{scanResult.participant?.teamColor || '-'}</span> | รถ: {scanResult.participant?.busNumber || '-'} {scanResult.participant?.score !== undefined ? `| คะแนนสะสมบุคคล: ${scanResult.participant.score} แต้ม` : ''}
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
            {participants.filter(Boolean).map(p => (
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
                {p.name || p.id} {p.foodClaimed ? '(รับแล้ว)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
