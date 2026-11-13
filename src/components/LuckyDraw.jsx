import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { DEFAULT_PRIZES, TEAM_COLORS } from '../utils/mockData';
import {
  playTick,
  playFanfare,
  AI_VOICES,
  getCurrentVoiceId,
  setCurrentVoiceId,
  speakAnnouncement,
  previewVoice,
} from '../utils/soundEffects';
import {
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  MaximizeIcon,
  MinimizeIcon,
  Volume2Icon,
} from './ui/Icons';

export default function LuckyDraw({ participants, onAwardPrize }) {
  const [selectedPrize, setSelectedPrize] = useState(DEFAULT_PRIZES[0]);
  const [filterMode, setFilterMode] = useState('all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPhase, setSpinPhase] = useState('idle');
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [winner, setWinner] = useState(null);
  const [noticeMsg, setNoticeMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState(() => getCurrentVoiceId());
  const [isPlayingTestVoice, setIsPlayingTestVoice] = useState(false);

  const containerRef = useRef(null);

  const eligiblePool = participants.filter((p) => {
    if (!p) return false;
    if (p.wonPrize) return false;
    if (filterMode === 'contestants') return p.joinEveningContest === 'yes';
    if (filterMode === 'high-score') return (p.score || 0) >= 50;
    return true;
  });

  const pastWinners = participants.filter((p) => p && p.wonPrize);

  // Sync fullscreen state with browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(active);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Toggle Kiosk Fullscreen
  const toggleFullscreen = async () => {
    try {
      const target = containerRef.current;
      if (!target) return;

      if (!document.fullscreenElement) {
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          await target.webkitRequestFullscreen();
        } else if (target.mozRequestFullScreen) {
          await target.mozRequestFullScreen();
        } else if (target.msRequestFullscreen) {
          await target.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Stage Keyboard Shortcuts: Space/Enter = Spin, F = Fullscreen toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if ((e.code === 'Space' || e.code === 'Enter') && !isSpinning && eligiblePool.length > 0) {
        e.preventDefault();
        startRandomDraw();
      } else if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, eligiblePool, selectedPrize, filterMode, activeVoiceId]);

  const handleVoiceChange = (newVoiceId) => {
    setActiveVoiceId(newVoiceId);
    setCurrentVoiceId(newVoiceId);
  };

  const handleTestVoice = (voiceIdToTest) => {
    setIsPlayingTestVoice(true);
    previewVoice(voiceIdToTest || activeVoiceId);
    setTimeout(() => setIsPlayingTestVoice(false), 2800);
  };

  const startRandomDraw = () => {
    if (eligiblePool.length === 0) {
      setNoticeMsg('ไม่มีรายชื่อผู้มีสิทธิ์จับรางวัลในเงื่อนไขนี้ หรือทุกคนได้รับรางวัลครบแล้ว');
      setTimeout(() => setNoticeMsg(''), 4000);
      return;
    }

    setNoticeMsg('');
    setIsSpinning(true);
    setSpinPhase('fast');
    setWinner(null);

    const finalWinner = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];

    let currentInterval = 45;
    let stepCount = 0;
    const fastSteps = 30;
    const slowSteps = 16;

    const runStep = () => {
      const randomCandidate = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
      setCurrentCandidate(randomCandidate);
      playTick(500 + Math.random() * 200);

      stepCount++;

      if (stepCount < fastSteps) {
        setTimeout(runStep, currentInterval);
      } else if (stepCount < fastSteps + slowSteps) {
        setSpinPhase('slowing');
        const slowStepIndex = stepCount - fastSteps;
        currentInterval = Math.round(50 + Math.pow(slowStepIndex * 1.5, 2.5));

        if (slowStepIndex >= slowSteps - 1) {
          setCurrentCandidate(finalWinner);
        }

        setTimeout(runStep, currentInterval);
      } else {
        setCurrentCandidate(finalWinner);
        setWinner(finalWinner);
        setSpinPhase('revealed');
        setIsSpinning(false);

        playFanfare();
        triggerConfetti();
        onAwardPrize(finalWinner.id, selectedPrize.name);

        // TTS Stage Winner Announcement: ขานชื่อและรหัสพนักงานอัตโนมัติเมื่อหมุนหยุด
        setTimeout(() => {
          const announceText = `ขอแสดงความยินดีกับคุณ ${finalWinner.name} รหัสพนักงาน ${finalWinner.id} ได้รับรางวัล ${selectedPrize.name} ค่ะ`;
          speakAnnouncement(announceText, activeVoiceId);
        }, 1100);
      }
    };

    runStep();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: isFullscreen ? 160 : 100,
        spread: isFullscreen ? 90 : 70,
        origin: { y: isFullscreen ? 0.5 : 0.6 },
        colors: ['#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#ffffff'],
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const candidateTeam = currentCandidate
    ? TEAM_COLORS.find((t) => t.id === currentCandidate.teamColor)
    : null;

  const currentVoiceObj = AI_VOICES.find((v) => v.id === activeVoiceId) || AI_VOICES[0];

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-[#07090e] text-white p-4 sm:p-8 md:p-12 flex flex-col justify-between overflow-y-auto min-h-screen select-none'
          : 'max-w-5xl mx-auto p-2 sm:p-4 space-y-6'
      }`}
      style={
        isFullscreen
          ? {
              backgroundImage:
                'radial-gradient(ellipse at 50% 15%, rgba(245, 158, 11, 0.15) 0%, rgba(9, 10, 15, 0.98) 70%, #050608 100%)',
            }
          : undefined
      }
    >
      {/* 1. Header Bar & Kiosk Fullscreen Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 font-mono">
              STAGE LUCKY DRAW
            </span>
            {isFullscreen && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold animate-pulse">
                KIOSK FULLSCREEN ON
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
              AI TTS: {currentVoiceObj.name}
            </span>
          </div>
          <h2
            className={`font-black tracking-tight ${
              isFullscreen
                ? 'text-3xl sm:text-4xl text-amber-300'
                : 'text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-50'
            }`}
          >
            ระบบสุ่มจับรางวัลประจำงานเลี้ยง (Lucky Draw)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {isFullscreen
              ? 'โหมดโปรเจกเตอร์เวทีหลัก • ควบคุมด้วยปุ่ม [Spacebar] เพื่อสุ่ม | กด [Esc] หรือ [F] เพื่อย่อจอ'
              : 'สำหรับแสดงผลขึ้นจอโปรเจกเตอร์หลัก พร้อมระบบขานชื่อผู้ชนะอัตโนมัติออกลำโพง'}
          </p>
        </div>

        {/* Kiosk Fullscreen Trigger Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              isFullscreen
                ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 hover:text-white font-extrabold shadow-md active:scale-95'
            }`}
            title="กดปุ่ม F หรือคลิกเพื่อสลับโหมดจอเต็มโปรเจกเตอร์"
          >
            {isFullscreen ? (
              <>
                <MinimizeIcon className="w-4 h-4" />
                <span>ออกจากจอเต็ม (Esc)</span>
              </>
            ) : (
              <>
                <MaximizeIcon className="w-4 h-4" />
                <span>🖥️ เปิดจอเต็ม (Kiosk Fullscreen)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {noticeMsg && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold"
        >
          {noticeMsg}
        </div>
      )}

      {/* 2. Control Cards: Prize, Filter, and 10 AI Voice Selector */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 ${
          isFullscreen ? 'max-w-5xl mx-auto w-full' : ''
        }`}
      >
        {/* Card 1: Prize */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1.5 transition-colors ${
            isFullscreen
              ? 'bg-zinc-900/80 border-amber-500/20'
              : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <label className="text-xs font-bold text-zinc-400 block">
            1. เลือกรายการของรางวัล:
          </label>
          <select
            disabled={isSpinning}
            value={selectedPrize.id}
            onChange={(e) => {
              const f = DEFAULT_PRIZES.find((p) => p.id === e.target.value);
              if (f) setSelectedPrize(f);
            }}
            className={`w-full border rounded-xl p-2.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isFullscreen
                ? 'bg-zinc-950 text-white border-zinc-700'
                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {DEFAULT_PRIZES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Card 2: Filter */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1.5 transition-colors ${
            isFullscreen
              ? 'bg-zinc-900/80 border-amber-500/20'
              : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <label className="text-xs font-bold text-zinc-400 block">
            2. กลุ่มผู้มีสิทธิ์ลุ้นรางวัล:
          </label>
          <select
            disabled={isSpinning}
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className={`w-full border rounded-xl p-2.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isFullscreen
                ? 'bg-zinc-950 text-white border-zinc-700'
                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            <option value="all">
              ผู้ร่วมงานที่ยังไม่ได้รางวัล ({participants.filter((p) => !p.wonPrize).length} ท่าน)
            </option>
            <option value="contestants">
              เฉพาะผู้ประกวดชุดงานค่ำ (
              {participants.filter((p) => !p.wonPrize && p.joinEveningContest === 'yes').length} ท่าน)
            </option>
            <option value="high-score">
              ผู้มีคะแนน 50 แต้มขึ้นไป (
              {participants.filter((p) => !p.wonPrize && (p.score || 0) >= 50).length} ท่าน)
            </option>
          </select>
        </div>

        {/* Card 3: 10 AI Voice Models Selector */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-1.5 transition-colors ${
            isFullscreen
              ? 'bg-zinc-900/80 border-amber-500/20'
              : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 block">
              3. เสียงสปีกเกอร์ AI ขานรางวัล:
            </label>
            <button
              type="button"
              onClick={() => handleTestVoice(activeVoiceId)}
              className="text-[11px] font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="ทดสอบฟังตัวอย่างเสียงที่เลือก"
            >
              <Volume2Icon className={`w-3.5 h-3.5 ${isPlayingTestVoice ? 'animate-bounce text-emerald-400' : ''}`} />
              <span>{isPlayingTestVoice ? 'กำลังทดสอบ...' : '▶️ ทดสอบเสียง'}</span>
            </button>
          </div>

          <select
            disabled={isSpinning}
            value={activeVoiceId}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className={`w-full border rounded-xl p-2.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isFullscreen
                ? 'bg-zinc-950 text-white border-zinc-700'
                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            <optgroup label="🌟 Google Gemini AI Models">
              {AI_VOICES.filter((v) => v.tag === 'Gemini AI').map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} • {v.desc.split(' ')[0]}
                </option>
              ))}
            </optgroup>
            <optgroup label="🎤 สปีกเกอร์เวที & ดีเจ">
              {AI_VOICES.filter((v) => v.tag !== 'Gemini AI').map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} • {v.desc.split(' ')[0]}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* 3. Main Stage Display (Adaptive Scale for Fullscreen Projector) */}
      <div
        className={`border rounded-3xl text-center shadow-2xl transition-all ${
          isFullscreen
            ? 'bg-zinc-950/90 border-amber-500/30 p-8 sm:p-12 max-w-4xl mx-auto w-full my-auto'
            : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 space-y-6'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs sm:text-sm font-black shadow-xs">
          <TrophyIcon className="w-5 h-5 text-amber-400 animate-bounce" />
          <span>รางวัลที่กำลังสุ่ม: {selectedPrize.name}</span>
        </div>

        <div
          className={`max-w-2xl mx-auto rounded-3xl p-6 sm:p-12 border transition-all duration-300 mt-4 ${
            winner
              ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] scale-[1.03]'
              : isSpinning
              ? spinPhase === 'slowing'
                ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                : 'bg-zinc-900/80 border-zinc-700'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="mb-4">
            {spinPhase === 'idle' && (
              <span className="text-xs sm:text-sm font-mono tabular-nums text-zinc-400 font-semibold">
                รายชื่อในระบบพร้อมสุ่ม ({eligiblePool.length} ท่าน)
              </span>
            )}
            {spinPhase === 'fast' && (
              <span className="text-sm sm:text-base text-emerald-400 font-extrabold animate-pulse">
                ⚡ กำลังสุ่มสลับรายชื่อผู้โชคดี...
              </span>
            )}
            {spinPhase === 'slowing' && (
              <span className="text-sm sm:text-base text-amber-400 font-extrabold">
                ⏳ กำลังชะลอความเร็วเพื่อประกาศผล...
              </span>
            )}
            {spinPhase === 'revealed' && (
              <div className="space-y-1 animate-bounce">
                <span className="inline-flex items-center gap-2 text-sm sm:text-base text-emerald-400 font-black uppercase tracking-wider">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>🎉 ขอแสดงความยินดีกับผู้ได้รับรางวัล! 🎉</span>
                </span>
              </div>
            )}
          </div>

          {currentCandidate ? (
            <div className="space-y-4">
              <span className="text-sm sm:text-base font-mono tabular-nums font-bold text-zinc-400">
                รหัสพนักงาน: {currentCandidate.id}
              </span>
              <h3
                className={`font-black tracking-tight text-white transition-all ${
                  isFullscreen
                    ? 'text-4xl sm:text-6xl md:text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]'
                    : 'text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50'
                }`}
              >
                {currentCandidate?.name || 'ผู้ร่วมงาน'}
              </h3>

              <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2">
                {candidateTeam && (
                  <span
                    className={`px-4 py-1.5 rounded-full font-black text-white shadow-md ${
                      isFullscreen ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                    }`}
                    style={{ backgroundColor: candidateTeam.hex }}
                  >
                    {candidateTeam?.name || 'ทีมสี'}
                  </span>
                )}
                <span
                  className={`px-4 py-1.5 rounded-full font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 ${
                    isFullscreen ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                  }`}
                >
                  {currentCandidate.busNumber}
                </span>
              </div>

              {/* Speaker Replay Button when winner is revealed */}
              {winner && (
                <div className="pt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      speakAnnouncement(
                        `ขอแสดงความยินดีกับคุณ ${winner.name} รหัสพนักงาน ${winner.id} ได้รับรางวัล ${selectedPrize.name} ค่ะ`,
                        activeVoiceId
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    title="คลิกเพื่อขานชื่อผู้ชนะออกลำโพงอีกครั้ง"
                  >
                    <Volume2Icon className="w-4 h-4 text-amber-400" />
                    <span>ขานชื่อซ้ำออกลำโพง ({currentVoiceObj.name})</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-400 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-amber-400">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <p className="text-sm sm:text-base font-bold text-zinc-300">
                กดปุ่มด้านล่าง หรือกดแป้น [Spacebar] เพื่อเริ่มสุ่มรายชื่อ
              </p>
              <p className="text-xs text-zinc-500">
                ระบบจะขานชื่อและรหัสพนักงานของผู้ได้รับรางวัลออกลำโพงโดยอัตโนมัติ
              </p>
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isSpinning || eligiblePool.length === 0}
            onClick={startRandomDraw}
            className={`transition-all shadow-xl cursor-pointer ${
              isFullscreen
                ? 'px-12 py-5 rounded-2xl text-lg sm:text-xl font-black'
                : 'px-8 py-3.5 rounded-xl text-sm font-bold'
            } ${
              isSpinning || eligiblePool.length === 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isFullscreen
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 hover:brightness-110 active:scale-95 shadow-amber-500/30'
                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 active:scale-95'
            }`}
          >
            {isSpinning ? '🎲 กำลังสุ่มรายชื่อ...' : '🎰 เริ่มสุ่มจับรางวัล (Space)'}
          </button>
        </div>
      </div>

      {/* 4. History Winners */}
      {pastWinners.length > 0 && (
        <div
          className={`border rounded-3xl p-5 sm:p-7 shadow-xs space-y-4 ${
            isFullscreen
              ? 'bg-zinc-900/60 border-zinc-800 max-w-4xl mx-auto w-full mt-4'
              : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>ทำเนียบผู้ได้รับรางวัล</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-xs font-mono font-bold">
                {pastWinners.length} ท่าน
              </span>
            </h4>
            {isFullscreen && (
              <span className="text-xs text-zinc-500 font-mono">
                Kiosk Mode Active
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {pastWinners.map((w) => (
              <div
                key={w.id}
                className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {w?.name || w?.id}{' '}
                    <span className="font-mono tabular-nums text-zinc-500">({w?.id})</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                    <TrophyIcon className="w-3 h-3" />
                    <span>{w.wonPrizeName}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    speakAnnouncement(
                      `ขอแสดงความยินดีกับคุณ ${w.name} รหัสพนักงาน ${w.id} ได้รับรางวัล ${w.wonPrizeName} ค่ะ`,
                      activeVoiceId
                    )
                  }
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
                  title="ขานชื่อผู้ได้รับรางวัลท่านนี้"
                >
                  <Volume2Icon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
