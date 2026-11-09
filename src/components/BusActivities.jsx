import React, { useState } from 'react';
import { DEFAULT_QUIZZES } from '../utils/mockData';
import { playSuccess } from '../utils/soundEffects';
import MusicGuessingGame from './MusicGuessingGame';
import { BusIcon, GridPuzzleIcon, CheckCircleIcon, ChevronRightIcon } from './ui/Icons';

export default function BusActivities({
  participant,
  onSaveActivity,
  onAddScore,
  onOpenSpotDifference,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(participant.quizAnswered || false);
  const [costumeInspiration, setCostumeInspiration] = useState(
    participant.costumeInspiration || ''
  );
  const [joinEveningContest, setJoinEveningContest] = useState(
    participant.joinEveningContest || 'yes'
  );
  const [saveStatus, setSaveStatus] = useState('');

  const handleSelectOption = (quizId, optIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [quizId]: optIdx });
  };

  const handleQuizSubmit = () => {
    let earned = 0;
    DEFAULT_QUIZZES.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        earned += q.points;
      }
    });

    setQuizSubmitted(true);
    playSuccess();
    onSaveActivity({
      id: participant.id,
      quizAnswered: true,
      quizScore: earned,
      costumeInspiration,
      joinEveningContest,
    });
    setSaveStatus('บันทึกคำตอบและสะสมคะแนนเข้าโปรไฟล์เรียบร้อยแล้ว');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const handleSaveContest = () => {
    onSaveActivity({
      id: participant.id,
      costumeInspiration,
      joinEveningContest,
    });
    playSuccess();
    setSaveStatus('บันทึกข้อมูลการประกวดชุดเรียบร้อยแล้ว');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <BusIcon className="w-4 h-4" />
          <span>ON-BOARD ACTIVITIES & CONTEST</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          กิจกรรมสันทนาการบนรถบัส & ลงทะเบียนประกวดชุด
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          ร่วมสนุกกับเกมตอบคำถามระหว่างเดินทางเพื่อสะสมคะแนนให้ทีมสี และลงทะเบียนประกวดชุดงานเลี้ยงช่วงค่ำ
        </p>
      </div>

      {saveStatus && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2"
        >
          <CheckCircleIcon className="w-4 h-4 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Grid of Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Quiz on Bus (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono block">
                ACTIVITY 01 • SPEED QUIZ
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                คำถามชิงคะแนนประจำทริป
              </h3>
            </div>
            {quizSubmitted && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>ส่งคำตอบแล้ว</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            {DEFAULT_QUIZZES.map((q, idx) => (
              <div
                key={q.id}
                className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 p-4 rounded-2xl space-y-3"
              >
                <div className="flex items-start justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <span className="text-sm sm:text-base font-bold">
                    ข้อที่ {idx + 1}: {q.question}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums whitespace-nowrap ml-2 text-xs sm:text-sm font-bold">
                    +{q.points} แต้ม
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    let btnStyle =
                      'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/60';

                    if (isSelected) {
                      btnStyle =
                        'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow-xs';
                    }
                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle =
                          'bg-emerald-600 text-white border-transparent font-bold';
                      } else if (isSelected && optIdx !== q.correctIndex) {
                        btnStyle =
                          'bg-red-500/15 text-red-600 dark:text-red-400 line-through border-red-500/30';
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left p-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-mono mr-1.5 opacity-60 font-bold">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    เฉลย: {q.options[q.correctIndex]} — {q.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              type="button"
              onClick={handleQuizSubmit}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              ส่งคำตอบและรับคะแนนสะสม
            </button>
          ) : (
            <div className="text-center text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold py-2">
              บันทึกคะแนนสะสมเข้าสู่ระบบเรียบร้อยแล้ว
            </div>
          )}
        </div>

        {/* Card 2: Costume & Evening Gala Opt-In (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Costume Inspiration Box */}
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono block">
                ACTIVITY 02 • EVENING GALA CONTEST
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                ลงทะเบียนประกวดชุดงานเลี้ยงค่ำ
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                ระบุแนวคิดหรือแรงบันดาลใจของชุดที่สวมใส่ เพื่อใช้ประกอบการแนะนำตัวบนเวที
              </p>
            </div>

            <textarea
              rows={3}
              value={costumeInspiration}
              onChange={(e) => setCostumeInspiration(e.target.value)}
              placeholder="ระบุคอนเซปต์ชุดของคุณ เช่น ชุดเดินป่าซาฟารีรับธีม Meet the Jungle..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            />

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
              <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                ยืนยันการเข้าร่วมประกวดชุดบนเวทีช่วงค่ำ:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setJoinEveningContest('yes')}
                  className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                    joinEveningContest === 'yes'
                      ? 'bg-emerald-600 text-white border-transparent shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  เข้าร่วมประกวด
                </button>
                <button
                  type="button"
                  onClick={() => setJoinEveningContest('no')}
                  className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                    joinEveningContest === 'no'
                      ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950 border-transparent shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  ร่วมชมเป็นกองเชียร์
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveContest}
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-bold transition-all active:scale-[0.98] cursor-pointer"
            >
              บันทึกข้อมูลการประกวดชุด
            </button>
          </div>

          {/* Spot the Difference Game Link Card */}
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <GridPuzzleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    เกมจับผิดภาพ 10 ด่าน & เรียงสีน้ำ
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    ค้นหาจุดต่างในภาพเพื่อรับคะแนนพิเศษเพิ่มให้ทีมสี
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSpotDifference}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-xs active:scale-95 shrink-0 cursor-pointer"
              >
                <span>เปิดเกม</span>
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive 3-Sec Music Guessing & YouTube MV Player */}
          <MusicGuessingGame onAddScore={onAddScore} />
        </div>
      </div>
    </div>
  );
}
