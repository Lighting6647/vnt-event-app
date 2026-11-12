import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playTick, playSuccess, playFanfare } from '../utils/soundEffects';
import { SparklesIcon, CheckCircleIcon, TrophyIcon } from './ui/Icons';
import { TEAM_COLORS } from '../utils/mockData';

const WHEEL_SEGMENTS = [
  { id: 1, label: '+10 แต้ม', points: 10, bg: '#10b981', text: '#ffffff', icon: '⭐' },
  { id: 2, label: '+20 แต้ม', points: 20, bg: '#3b82f6', text: '#ffffff', icon: '🎉' },
  { id: 3, label: '+5 แต้ม', points: 5, bg: '#f59e0b', text: '#000000', icon: '🎁' },
  { id: 4, label: '+30 แต้ม', points: 30, bg: '#a855f7', text: '#ffffff', icon: '💎' },
  { id: 5, label: '+15 แต้ม', points: 15, bg: '#06b6d4', text: '#ffffff', icon: '⚡' },
  { id: 6, label: 'JACKPOT +50', points: 50, bg: '#eab308', text: '#000000', icon: '🏆' },
  { id: 7, label: '+10 แต้ม', points: 10, bg: '#f43f5e', text: '#ffffff', icon: '🌟' },
  { id: 8, label: '+25 แต้ม', points: 25, bg: '#6366f1', text: '#ffffff', icon: '✨' },
];

export default function LuckyWheel({ participant, onAddScore }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [hasClaimedPoints, setHasClaimedPoints] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Track spins in local storage per participant
  const storageKey = participant?.id ? `tour_wheel_spin_${participant.id}` : 'tour_wheel_spin_guest';
  const [spinCount, setSpinCount] = useState(() => {
    try {
      return Number(localStorage.getItem(storageKey) || 0);
    } catch {
      return 0;
    }
  });

  const currentRotationRef = useRef(0);
  const tickIntervalRef = useRef(null);

  const team = participant && TEAM_COLORS.find(t => t.id === participant.teamColor);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedResult(null);
    setHasClaimedPoints(false);
    setStatusMessage('');

    // Pick random target slice (0 to 7)
    const targetIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length; // 45 deg

    // Slices are drawn starting from 0 deg at top.
    // The pointer needle is fixed at the TOP (0 deg).
    // To land slice i at 0 deg, the wheel must rotate to: (360 - (i * 45 + 22.5))
    const sliceCenter = targetIndex * segmentAngle + segmentAngle / 2;
    const extraFullRotations = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7 full spins
    const targetDegree = currentRotationRef.current + extraFullRotations + (360 - (currentRotationRef.current % 360)) + (360 - sliceCenter);

    currentRotationRef.current = targetDegree;
    setRotation(targetDegree);

    // Audio ticks during spinning
    let tickSpeed = 60;
    let elapsed = 0;
    const duration = 4500;

    const playTicks = () => {
      playTick(450 + Math.random() * 100);
      elapsed += tickSpeed;
      if (elapsed < duration) {
        tickSpeed = Math.min(300, tickSpeed * 1.06);
        tickIntervalRef.current = setTimeout(playTicks, tickSpeed);
      }
    };
    playTicks();

    // Finish spinning after 4.5 seconds
    setTimeout(() => {
      clearTimeout(tickIntervalRef.current);
      setIsSpinning(false);
      const wonSegment = WHEEL_SEGMENTS[targetIndex];
      setSelectedResult(wonSegment);

      // Sound & confetti
      if (wonSegment.points >= 30) {
        playFanfare();
      } else {
        playSuccess();
      }

      try {
        confetti({
          particleCount: wonSegment.points >= 30 ? 120 : 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#ffffff'],
        });
      } catch {}

      // Update spin count
      const nextCount = spinCount + 1;
      setSpinCount(nextCount);
      try {
        localStorage.setItem(storageKey, String(nextCount));
      } catch {}
    }, 4500);
  };

  const handleClaimPoints = () => {
    if (!selectedResult || hasClaimedPoints || !participant || !onAddScore) return;
    
    onAddScore(participant.id, selectedResult.points);
    setHasClaimedPoints(true);
    playSuccess();
    setStatusMessage(`บันทึกคะแนนสะสม +${selectedResult.points} แต้ม เรียบร้อยแล้ว!`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleResetCooldown = () => {
    setSpinCount(0);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setStatusMessage('รีเซ็ตสิทธิ์การหมุนวงล้อเรียบร้อยแล้ว');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono block">
            ACTIVITY 03 • LUCKY WHEEL
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            วงล้อหมุนนำโชค (Lucky Wheel)
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            หมุนวงล้อลุ้นรับคะแนนสะสมพิเศษ 5 – 50 แต้ม มอบให้ทีมสีของคุณ
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <SparklesIcon className="w-5 h-5" />
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircleIcon className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Wheel Stage */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        {/* Fixed Top Pointer Needle */}
        <div className="relative z-20 -mb-4.5 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-red-500 drop-shadow-md" />
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs -mt-6 border-2 border-red-500" />
        </div>

        {/* Rotating Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 p-2">
          {/* Outer Ring Border */}
          <div className="absolute inset-0 rounded-full border-4 border-zinc-900 dark:border-zinc-100/80 shadow-xl pointer-events-none z-10" />

          {/* Slices SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full rounded-full transition-transform duration-[4500ms]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.15, 1)',
            }}
          >
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const count = WHEEL_SEGMENTS.length;
              const angle = 360 / count;
              const startAngle = (idx * angle - 90) * (Math.PI / 180);
              const endAngle = ((idx + 1) * angle - 90) * (Math.PI / 180);

              const x1 = 50 + 50 * Math.cos(startAngle);
              const y1 = 50 + 50 * Math.sin(startAngle);
              const x2 = 50 + 50 * Math.cos(endAngle);
              const y2 = 50 + 50 * Math.sin(endAngle);

              const textAngle = idx * angle + angle / 2;

              return (
                <g key={seg.id}>
                  {/* Slice Wedge */}
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={seg.bg}
                    stroke="#ffffff"
                    strokeWidth="0.75"
                  />
                  {/* Text on Slice */}
                  <text
                    x="50"
                    y="18"
                    transform={`rotate(${textAngle}, 50, 50)`}
                    fill={seg.text}
                    fontSize="4.8"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Prompt, sans-serif"
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}
            {/* Center Circle Pin */}
            <circle cx="50" cy="50" r="10" fill="#18181b" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="6" fill="#10b981" />
          </svg>
        </div>

        {/* Spin Result & Award Card */}
        {selectedResult && (
          <div className="w-full max-w-sm mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-amber-500/40 text-center space-y-2 animate-in zoom-in-95 duration-200 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
              ผลการหมุนวงล้อ
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{selectedResult.icon}</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono">
                {selectedResult.label}
              </span>
            </div>
            {participant && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                มอบให้คุณ <span className="font-bold text-zinc-800 dark:text-zinc-200">{participant.name}</span>
                {team ? ` (ทีม${team.name})` : ''}
              </p>
            )}

            <button
              type="button"
              disabled={hasClaimedPoints}
              onClick={handleClaimPoints}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                hasClaimedPoints
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-not-allowed border border-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
              }`}
            >
              {hasClaimedPoints ? '✓ บันทึกคะแนนเข้าโปรไฟล์แล้ว' : `กดรับคะแนน +${selectedResult.points} แต้มทันที`}
            </button>
          </div>
        )}

        {/* Spin Control Button */}
        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className={`w-full py-3.5 px-6 rounded-2xl text-sm sm:text-base font-extrabold transition-all shadow-md active:scale-95 cursor-pointer ${
              isSpinning
                ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/25'
            }`}
          >
            {isSpinning ? 'วงล้อกำลังหมุน...' : '🎯 กดหมุนวงล้อสะสมแต้ม!'}
          </button>

          <div className="flex items-center justify-between w-full px-2 text-[11px] text-zinc-500">
            <span>หมุนไปแล้ว: {spinCount} ครั้ง</span>
            <button
              type="button"
              onClick={handleResetCooldown}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline cursor-pointer"
            >
              รีเซ็ตสิทธิ์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
