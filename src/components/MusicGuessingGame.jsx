import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playSuccess, playTick, playFanfare } from '../utils/soundEffects';
import { TEAM_COLORS } from '../utils/mockData';
import { SparklesIcon, CheckCircleIcon, TrophyIcon } from './ui/Icons';

// Playlist of Trending, Modern Thai Hit Songs
const MODERN_HIT_SONGS = [
  {
    id: 1,
    title: 'Stand by หล่อ',
    artist: 'New Country (นิวคันทรี่)',
    year: '2023–2024',
    genre: 'T-Pop ลูกทุ่งโมเดิร์น',
    youtubeId: 'uxvAQbX0nSI',
    startSeconds: 48,
    lyricsHint: 'โดนัทยังมีรู แล้วเมื่อไหร่ยูจะมีใจ...',
    trivia: 'เพลงไวรัลท่าเต้นโดนัทยังมีรูที่ร้องตามกันได้ทั้งคันรถ',
    notes: [392, 440, 523, 587, 659, 587, 523],
  },
  {
    id: 2,
    title: 'ทรงอย่างแบด (Bad Boy)',
    artist: 'Paper Planes',
    year: '2023',
    genre: 'Pop Punk / Rock',
    youtubeId: 'cqQAzpZBpAw',
    startSeconds: 52,
    lyricsHint: 'ทรงอย่างแบด แซดอย่างบ่อย เธอไม่อินกับผู้ชาย bad boy...',
    trivia: 'เพลงฮิตขวัญใจมหาชน ยอดวิวทะลุ 160 ล้านวิว',
    notes: [330, 330, 392, 330, 440, 392, 330],
  },
  {
    id: 3,
    title: 'โต๊ะริม (melt)',
    artist: 'NONT TANONT (นนท์ ธนนท์)',
    year: '2023–2024',
    genre: 'Soul Pop',
    youtubeId: 'XqQMisU5En8',
    startSeconds: 65,
    lyricsHint: 'เธอมาทำให้ละลาย โดนสะกดดวงใจตั้งแต่วันที่ได้สบตา...',
    trivia: 'เพลงฮิตติดอันดับ 1 ทุกชาร์ตวิทยุของนนท์ ธนนท์',
    notes: [261, 329, 392, 523, 493, 392],
  },
  {
    id: 4,
    title: 'เลือดกรุ๊ปบี (B Blood Type)',
    artist: 'Chrrissa Chame (เอิ้ก ชาลิสา)',
    year: '2023',
    genre: 'Pop / Viral Hit',
    youtubeId: 'q5nAxoCIvy4',
    startSeconds: 50,
    lyricsHint: 'ก็เรามันเลือดกรุ๊ปบี จะไปมีสิทธิ์อะไรกับเขา...',
    trivia: 'เพลงฮิตติดหูจากวลีดัง "สงสัยเป็นเพราะเลือดกรุ๊ปบี"',
    notes: [349, 392, 440, 523, 440, 392],
  },
  {
    id: 5,
    title: 'ฉลามชอบงับคุณ',
    artist: 'BONNADOL ft. IIVY B',
    year: '2023–2024',
    genre: 'T-Pop Dance',
    youtubeId: 'IkxhsTwNybU',
    startSeconds: 38,
    lyricsHint: 'ฉลามนั้นชอบงับคุณ แต่ผมน่ะชอบคุณงับ...',
    trivia: 'เพลงจังหวะสนุกสนานสำหรับกิจกรรมสันทนาการ',
    notes: [523, 587, 659, 698, 659, 587, 523],
  },
  {
    id: 6,
    title: 'ฟ้ารักพ่อ (DILF)',
    artist: 'Badmixy ft. ยุ้ย ญาติเยอะ',
    year: '2024',
    genre: 'Dance EDM / T-Pop',
    youtubeId: 'L1Bfsj7To8g',
    startSeconds: 55,
    lyricsHint: 'ฟ้ารักพ่อ ฟ้ารักพ่อ ได้ยินไหม...',
    trivia: 'เพลงแดนซ์จังหวะสนุกผสมลูกทุ่งโมเดิร์น',
    notes: [440, 554, 659, 880, 659, 554],
  },
];

export default function MusicGuessingGame({ onAddScore }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedAwardColor, setSelectedAwardColor] = useState('yellow');
  const [awardedFeedback, setAwardedFeedback] = useState('');

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  const currentSong = MODERN_HIT_SONGS[currentIdx];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleSelectSong = (idx) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlayingTeaser(false);
    setCountdown(0);
    setIsRevealed(false);
    setShowVideo(false);
    setAwardedFeedback('');
    setCurrentIdx(idx);
    playTick();
  };

  const handlePlay3SecTeaser = () => {
    if (isPlayingTeaser) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      setIsPlayingTeaser(true);
      setCountdown(3);

      const notes = currentSong.notes;
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.4);

        gain.gain.setValueAtTime(0.25, now + i * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.4 + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 0.4);
      });

      for (let t = 0; t < 3; t += 0.5) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(140, now + t);
        kickOsc.frequency.exponentialRampToValueAtTime(30, now + t + 0.2);
        kickGain.gain.setValueAtTime(0.3, now + t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.2);
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(now + t);
        kickOsc.stop(now + t + 0.2);
      }

      let timeLeft = 3;
      timerRef.current = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          clearInterval(timerRef.current);
          setIsPlayingTeaser(false);
          setCountdown(0);
        } else {
          setCountdown(timeLeft);
        }
      }, 1000);
    } catch (e) {
      console.warn('Audio play error:', e);
      setIsPlayingTeaser(false);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setShowVideo(true);
    playSuccess();
  };

  const handleAwardPoints = () => {
    if (onAddScore) {
      onAddScore(selectedAwardColor, 10);
      playFanfare();
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      } catch {}
      const targetTeam = TEAM_COLORS.find((t) => t.id === selectedAwardColor);
      setAwardedFeedback(
        `เพิ่มคะแนน +10 แต้ม แก่ทีม${targetTeam?.name || selectedAwardColor} เรียบร้อยแล้ว`
      );
      setTimeout(() => setAwardedFeedback(''), 4000);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 overflow-hidden">
      {/* Header — Stacked vertically so the song selector never overflows out of narrow columns */}
      <div className="space-y-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono block">
            ACTIVITY 03 • 3-SEC MUSIC CHALLENGE
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            เกมทายเพลงฮิต 3 วินาที
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            เปิดอินโทรเพลง 3 วินาทีผ่านลำโพงรถบัส สมาชิกทีมใดยกมือตอบถูกรับคะแนนสะสมทันที
          </p>
        </div>

        {/* Song Number Selector Bar — Contained within card width */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-950/70 p-2 rounded-2xl border border-zinc-200/70 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-2">
            เลือกเพลงที่:
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {MODERN_HIT_SONGS.map((song, i) => (
              <button
                type="button"
                key={song.id}
                onClick={() => handleSelectSong(i)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-mono tabular-nums font-bold transition-all cursor-pointer ${
                  i === currentIdx
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Box */}
      <div className="bg-zinc-50 dark:bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 space-y-4">
        {/* Top Mystery Status Row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-mono font-extrabold text-sm text-amber-600 dark:text-amber-400">
              #{currentIdx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                MYSTERY TRACK 0{currentIdx + 1}
              </span>
              <div className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                {isRevealed
                  ? `${currentSong.title} — ${currentSong.artist}`
                  : 'ปริศนาเพลงฮิต (กดฟังอินโทร 3 วินาที)'}
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            {currentSong.genre}
          </span>
        </div>

        {/* 3-Second Audio Player Control Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
          {/* Play 3-Sec Button */}
          <button
            type="button"
            onClick={handlePlay3SecTeaser}
            disabled={isPlayingTeaser}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
              isPlayingTeaser
                ? 'bg-amber-500 text-zinc-950 animate-pulse'
                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950'
            }`}
          >
            {isPlayingTeaser ? (
              <span className="font-mono tabular-nums">
                กำลังเล่นอินโทร... ({countdown}s)
              </span>
            ) : (
              <span>กดฟังเสียง 3 วินาที</span>
            )}
          </button>

          {/* Reveal & Video Button */}
          {!isRevealed ? (
            <button
              type="button"
              onClick={handleReveal}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 shrink-0" />
              <span>เฉลยคำตอบ & เปิด MV</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowVideo(!showVideo)}
              className="w-full py-3 px-4 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{showVideo ? 'ซ่อนวิดีโอ MV' : 'แสดงวิดีโอ MV'}</span>
            </button>
          )}
        </div>

        {/* Revealed Content: Song Details & Video Player */}
        {isRevealed && (
          <div className="space-y-4 pt-2">
            {/* Song Meta Card */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-emerald-500/30 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 shrink-0" />
                  <span>เฉลย: {currentSong.title}</span>
                </span>
                <span className="text-xs font-mono tabular-nums text-zinc-500 font-semibold">
                  ปี {currentSong.year}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                ศิลปิน:{' '}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {currentSong.artist}
                </span>
              </p>
              <p className="text-xs sm:text-sm italic text-zinc-600 dark:text-zinc-400">
                ท่อนฮิต: "{currentSong.lyricsHint}"
              </p>
              <p className="text-xs text-zinc-500 pt-0.5">{currentSong.trivia}</p>
            </div>

            {/* Embedded YouTube MV Video Player */}
            {showVideo && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                  <span>มิวสิควิดีโอเพลงเต็ม:</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    เปิดใน YouTube ↗
                  </a>
                </div>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?autoplay=1&start=${currentSong.startSeconds}&rel=0`}
                    title={currentSong.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Give Score Quick Control for Staff */}
            <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <TrophyIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>มอบคะแนนให้ทีมที่ตอบถูก:</span>
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAwardColor}
                  onChange={(e) => setSelectedAwardColor(e.target.value)}
                  className="flex-1 min-w-0 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {TEAM_COLORS.map((c) => (
                    <option key={c.id} value={c.id}>
                      ทีม{c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAwardPoints}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform shrink-0 cursor-pointer"
                >
                  +10 แต้ม
                </button>
              </div>
            </div>

            {awardedFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                {awardedFeedback}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next / Previous Track Navigation Footer */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() =>
            handleSelectSong(
              (currentIdx - 1 + MODERN_HIT_SONGS.length) % MODERN_HIT_SONGS.length
            )
          }
          className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 cursor-pointer"
        >
          ← เพลงก่อนหน้า
        </button>

        <span className="text-xs font-mono tabular-nums font-bold text-zinc-500">
          {currentIdx + 1} / {MODERN_HIT_SONGS.length}
        </span>

        <button
          type="button"
          onClick={() => handleSelectSong((currentIdx + 1) % MODERN_HIT_SONGS.length)}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 active:scale-95 cursor-pointer"
        >
          เพลงถัดไป →
        </button>
      </div>
    </div>
  );
}
