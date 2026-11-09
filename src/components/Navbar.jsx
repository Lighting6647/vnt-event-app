import React from 'react';
import { DESIGN_THEMES } from '../utils/themes';

export default function Navbar({
  activeTab,
  setActiveTab,
  participants,
  selectedId,
  setSelectedId,
  currentTheme,
  setCurrentTheme,
}) {
  const currentParticipant = participants.find(p => p.id === selectedId) || participants[0];

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${currentTheme.navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">TOUR EVENT APP</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {currentTheme.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">ระบบจัดการงานทัวร์ & สันทนาการ 10 สี</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              onClick={() => setActiveTab('pass')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pass'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🪪 บัตรดิจิทัล
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              📷 สแกนเนอร์สตาฟ
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              📊 คะแนน 10 สี
            </button>

            <button
              onClick={() => setActiveTab('luckydraw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'luckydraw'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🎰 จอสุ่มรางวัลช้าๆ
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ⚙️ แอดมิน
            </button>
          </nav>

          {/* Controls: Theme Picker & User Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Live Theme Switcher */}
            <div className="flex items-center gap-1.5 bg-black/50 border border-white/20 rounded-xl px-2.5 py-1">
              <span className="text-xs">🎨</span>
              <select
                value={currentTheme.id}
                onChange={(e) => {
                  const found = DESIGN_THEMES.find(t => t.id === e.target.value);
                  if (found) setCurrentTheme(found);
                }}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {DESIGN_THEMES.map(theme => (
                  <option key={theme.id} value={theme.id} className="bg-slate-900 text-white">
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Switch User */}
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-black/50 border border-white/20 text-white text-xs rounded-xl px-2.5 py-1 font-medium focus:outline-none hidden sm:inline"
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.id}: {p.name}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-white/10 overflow-x-auto gap-1.5">
          <button
            onClick={() => setActiveTab('pass')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'pass' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
            }`}
          >
            🪪 บัตร QR
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'scanner' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
            }`}
          >
            📷 สแกนเนอร์
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'leaderboard' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
            }`}
          >
            📊 10 สี
          </button>
          <button
            onClick={() => setActiveTab('luckydraw')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'luckydraw' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
            }`}
          >
            🎰 สุ่มรางวัล
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-300'
            }`}
          >
            ⚙️ แอดมิน
          </button>
        </div>

      </div>
    </header>
  );
}
