import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DEFAULT_PRIZES, TEAM_COLORS } from '../utils/mockData';
import { playTick, playFanfare } from '../utils/soundEffects';
import { TrophyIcon, SparklesIcon, CheckCircleIcon } from './ui/Icons';

export default function LuckyDraw({ participants, onAwardPrize }) {
  const [selectedPrize, setSelectedPrize] = useState(DEFAULT_PRIZES[0]);
  const [filterMode, setFilterMode] = useState('all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPhase, setSpinPhase] = useState('idle');
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [winner, setWinner] = useState(null);
  const [noticeMsg, setNoticeMsg] = useState('');

  const eligiblePool = participants.filter((p) => {
    if (p.wonPrize) return false;
    if (filterMode === 'contestants') return p.joinEveningContest === 'yes';
    if (filterMode === 'high-score') return (p.score || 0) >= 50;
    return true;
  });

  const pastWinners = participants.filter((p) => p.wonPrize);

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
      const randomCandidate =
        eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
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
      }
    };

    runStep();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#0ea5e9', '#ffffff'],
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const candidateTeam = currentCandidate
    ? TEAM_COLORS.find((t) => t.id === currentCandidate.teamColor)
    : null;

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono block">
          STAGE LUCKY DRAW
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          ระบบสุ่มจับรางวัลประจำงานเลี้ยง (Lucky Draw)
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          สำหรับแสดงผลขึ้นจอโปรเจกเตอร์หลัก ระบบจะคัดกรองผู้ที่เคยได้รับรางวัลแล้วออกโดยอัตโนมัติ
        </p>
      </div>

      {noticeMsg && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold"
        >
          {noticeMsg}
        </div>
      )}

      {/* Control Card: Prize & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">
            เลือกรายการของรางวัล:
          </label>
          <select
            disabled={isSpinning}
            value={selectedPrize.id}
            onChange={(e) => {
              const f = DEFAULT_PRIZES.find((p) => p.id === e.target.value);
              if (f) setSelectedPrize(f);
            }}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {DEFAULT_PRIZES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">
            กลุ่มผู้มีสิทธิ์ลุ้นรางวัล:
          </label>
          <select
            disabled={isSpinning}
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">
              ผู้ร่วมงานทั้งหมดที่ยังไม่ได้รับรางวัล ({participants.filter((p) => !p.wonPrize).length} ท่าน)
            </option>
            <option value="contestants">
              เฉพาะผู้ลงทะเบียนประกวดชุดงานค่ำ (
              {participants.filter((p) => !p.wonPrize && p.joinEveningContest === 'yes').length} ท่าน)
            </option>
            <option value="high-score">
              เฉพาะผู้มีคะแนนสะสม 50 แต้มขึ้นไป (
              {participants.filter((p) => !p.wonPrize && (p.score || 0) >= 50).length} ท่าน)
            </option>
          </select>
        </div>
      </div>

      {/* Main Stage Display */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 text-center shadow-xs space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
          <TrophyIcon className="w-4 h-4" />
          <span>รางวัลที่กำลังสุ่ม: {selectedPrize.name}</span>
        </div>

        <div
          className={`max-w-xl mx-auto rounded-2xl p-8 sm:p-10 border transition-all duration-300 ${
            winner
              ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] border-emerald-500 shadow-lg scale-[1.02]'
              : isSpinning
              ? spinPhase === 'slowing'
                ? 'bg-zinc-50 dark:bg-zinc-950 border-amber-500'
                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          <div className="mb-3">
            {spinPhase === 'idle' && (
              <span className="text-xs font-mono tabular-nums text-zinc-500 font-semibold">
                รายชื่อในระบบพร้อมสุ่ม ({eligiblePool.length} ท่าน)
              </span>
            )}
            {spinPhase === 'fast' && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                กำลังสุ่มสลับรายชื่อผู้โชคดี...
              </span>
            )}
            {spinPhase === 'slowing' && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                กำลังชะลอความเร็วเพื่อประกาศผล...
              </span>
            )}
            {spinPhase === 'revealed' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                <CheckCircleIcon className="w-4 h-4" />
                <span>ขอแสดงความยินดีกับผู้ได้รับรางวัล</span>
              </span>
            )}
          </div>

          {currentCandidate ? (
            <div className="space-y-3">
              <span className="text-xs font-mono tabular-nums font-bold text-zinc-500">
                {currentCandidate.id}
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {currentCandidate.name}
              </h3>

              <div className="flex items-center justify-center gap-2 pt-2">
                {candidateTeam && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: candidateTeam.hex }}
                  >
                    {candidateTeam.name}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200/70 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {currentCandidate.busNumber}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-zinc-500 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-200/60 dark:bg-zinc-800 flex items-center justify-center text-amber-500">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium">กดปุ่มด้านล่างเพื่อเริ่มสุ่มรายชื่อผู้โชคดีบนหน้าจอ</p>
            </div>
          )}
        </div>

        {/* Start Button */}
        <div>
          <button
            type="button"
            disabled={isSpinning || eligiblePool.length === 0}
            onClick={startRandomDraw}
            className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer ${
              isSpinning || eligiblePool.length === 0
                ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 active:scale-95'
            }`}
          >
            {isSpinning ? 'กำลังสุ่มรายชื่อ...' : 'เริ่มสุ่มจับรางวัล'}
          </button>
        </div>
      </div>

      {/* History Winners */}
      {pastWinners.length > 0 && (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            ทำเนียบผู้ได้รับรางวัล ({pastWinners.length} ท่าน)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pastWinners.map((w) => (
              <div
                key={w.id}
                className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {w.name}{' '}
                    <span className="font-mono tabular-nums text-zinc-500">({w.id})</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                    <TrophyIcon className="w-3 h-3" />
                    <span>{w.wonPrizeName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
