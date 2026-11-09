import React, { useState } from 'react';
import { DEFAULT_QUIZZES } from '../utils/mockData';
import { playSuccess } from '../utils/soundEffects';

export default function ActivityModal({ participant, isOpen, onClose, onSave }) {
  if (!isOpen || !participant) return null;

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(participant.quizAnswered || false);
  const [earnedPoints, setEarnedPoints] = useState(participant.quizScore || 0);

  // Contest states
  const [costumeInspiration, setCostumeInspiration] = useState(participant.costumeInspiration || '');
  const [joinEveningContest, setJoinEveningContest] = useState(participant.joinEveningContest || 'yes');

  const handleSelectOption = (quizId, optIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [quizId]: optIndex });
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    DEFAULT_QUIZZES.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += q.points;
      }
    });

    setEarnedPoints(score);
    setQuizSubmitted(true);
    playSuccess();
  };

  const handleSaveAll = () => {
    onSave({
      id: participant.id,
      quizScore: quizSubmitted ? earnedPoints : 0,
      costumeInspiration,
      joinEveningContest,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              IN-APP ACTIVITIES • งานทัวร์ 2026
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              กิจกรรมตอบคำถาม & ข้อมูลประกวดชุด
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ผู้ร่วมงาน: <span className="text-white font-bold">{participant.name}</span> ({participant.id})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* 1. เกมตอบคำถามให้ถูกต้อง (Quiz Game) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs">
                1
              </span>
              เกมตอบคำถามชิงคะแนน (Quiz)
            </h4>
            {quizSubmitted && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ได้คะแนน +{earnedPoints} แต้ม
              </span>
            )}
          </div>

          <div className="space-y-4">
            {DEFAULT_QUIZZES.map((q, idx) => (
              <div key={q.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-200">
                    ข้อที่ {idx + 1}: {q.question}
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    +{q.points} แต้ม
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    let btnClass = 'bg-slate-950 text-slate-300 border-slate-800 hover:border-indigo-500';

                    if (isSelected) {
                      btnClass = 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30';
                    }

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnClass = 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold';
                      } else if (isSelected && optIdx !== q.correctIndex) {
                        btnClass = 'bg-rose-900/30 text-rose-300 border-rose-500 line-through';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left p-2.5 rounded-xl text-xs border transition-all ${btnClass}`}
                      >
                        <span className="font-mono mr-1.5 opacity-70">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="text-[11px] text-emerald-400/90 pt-1">
                    💡 เฉลย: {q.options[q.correctIndex]} — <em>{q.hint}</em>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              🚀 ตรวจคำตอบ & รับคะแนนทันที
            </button>
          ) : (
            <div className="text-center text-xs text-emerald-400 font-semibold py-1">
              ✓ ส่งคำตอบเรียบร้อยแล้ว ได้รับคะแนนสะสมเข้าโปรไฟล์
            </div>
          )}
        </div>

        {/* 2. คำถามประกวดเรื่องชุด & แรงบันดาลใจ */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xs">
              2
            </span>
            คำถามประกวดชุด & แรงบันดาลใจในการใส่ชุดนี้
          </h4>
          <p className="text-xs text-slate-400">
            โปรดบรรยายแนวคิด คอนเซปต์ หรือความหมายของชุดที่คุณเลือกใส่มางานทัวร์วันนี้ เพื่อนำไปขึ้นจอแนะนำตัวในงานเลี้ยง
          </p>
          <textarea
            value={costumeInspiration}
            onChange={(e) => setCostumeInspiration(e.target.value)}
            rows={3}
            placeholder="ตัวอย่าง: ธีมฮาวายสีฟ้าสดใส เข้ากับลมทะเล และช่วยเติมพลังความสดชื่นให้เพื่อนร่วมทีม..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* 4. คำถามปิดท้ายว่าจะมีการประกวดชุดตอนช่วงเย็น คุณต้องการเข้าร่วมหรือไม่ */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs">
              3
            </span>
            คำถามปิดท้าย: ยืนยันเข้าร่วมประกวดชุดช่วงเย็น?
          </h4>
          <p className="text-xs text-slate-400">
            จะมีการประกวดชุดแฟชั่นโชว์บนเวทีช่วงเย็น คุณต้องการเข้าร่วมการประกวดชิงรางวัลใหญ่หรือไม่?
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setJoinEveningContest('yes')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                joinEveningContest === 'yes'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>🎉</span> ต้องการเข้าร่วมประกวดชุด
            </button>

            <button
              type="button"
              onClick={() => setJoinEveningContest('no')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                joinEveningContest === 'no'
                  ? 'bg-slate-700 text-white border-slate-500 shadow-md ring-2 ring-slate-400/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>✋</span> ไม่ต้องการเข้าร่วม (ขอดูเป็นกองเชียร์)
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
          >
            💾 บันทึกข้อมูลกิจกรรม
          </button>
        </div>

      </div>
    </div>
  );
}
