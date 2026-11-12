import React, { useState, useMemo } from 'react';
import { TEAM_COLORS, BUSES } from '../utils/mockData';
import { SearchIcon, XIcon, CheckCircleIcon, UsersIcon } from './ui/Icons';
import { playSuccess, playTick } from '../utils/soundEffects';

export default function OnboardingIdentityModal({
  isOpen,
  participants,
  onSelectParticipant,
  onClose,
  allowClose = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusFilter, setSelectedBusFilter] = useState('all');
  const [confirmingPerson, setConfirmingPerson] = useState(null);

  const busOptions = useMemo(() => [
    { id: 'all', label: 'ทั้งหมด (182 ท่าน)' },
    { id: 'รถบัสคันที่ 1', label: 'บัส 1' },
    { id: 'รถบัสคันที่ 2', label: 'บัส 2' },
    { id: 'รถบัสคันที่ 3', label: 'บัส 3' },
    { id: 'รถบัสคันที่ 4', label: 'บัส 4' },
    { id: 'รถบัสคันที่ 5', label: 'บัส 5' },
  ], []);

  const filteredList = useMemo(() => {
    return (participants || []).filter((p) => {
      if (!p || !p.name) return false;

      // 1. Bus filter
      if (selectedBusFilter !== 'all') {
        if (!p.busNumber || !p.busNumber.includes(selectedBusFilter)) {
          return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name && p.name.toLowerCase().includes(q);
        const matchId = p.id && String(p.id).toLowerCase().includes(q);
        const matchTeam = p.teamColor && p.teamColor.toLowerCase().includes(q);
        const matchBus = p.busNumber && p.busNumber.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchTeam && !matchBus) {
          return false;
        }
      }

      return true;
    });
  }, [participants, selectedBusFilter, searchQuery]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!confirmingPerson) return;
    playSuccess();
    onSelectParticipant(confirmingPerson);
    setConfirmingPerson(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                🌴
              </span>
              <div>
                <h3 className="text-base sm:text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                  ยินดีต้อนรับสู่งานทัวร์ KoniX 2026
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium mt-0.5">
                  กรุณาแตะเลือกชื่อของท่านเพื่อผูกบัตรดิจิทัลเข้ากับมือถือเครื่องนี้
                </p>
              </div>
            </div>

            {allowClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center text-sm font-bold shrink-0 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="mt-3.5 relative">
            <SearchIcon className="w-5 h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="พิมพ์ชื่อพนักงาน หรือรหัส เช่น 500, ณัฐวุฒิ..."
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base font-semibold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Bus Filter Chips */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {busOptions.map((bus) => (
              <button
                key={bus.id}
                type="button"
                onClick={() => {
                  playTick();
                  setSelectedBusFilter(bus.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedBusFilter === bus.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {bus.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Attendees List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1 flex items-center justify-between">
            <span>พบรายชื่อ ({filteredList.length} ท่าน)</span>
            <span>แตะที่ชื่อของท่านเพื่อยืนยัน</span>
          </div>

          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredList.map((p) => {
                const team = TEAM_COLORS.find((t) => t.id === p.teamColor) || { name: p.teamColor, hex: '#10b981' };
                const isSelected = confirmingPerson?.id === p.id;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playTick();
                      setConfirmingPerson(p);
                    }}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 active:scale-[0.99] cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md'
                        : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200/80 dark:border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 truncate">
                        {p.name}
                      </div>
                      <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 mt-1 font-medium truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: team.hex }}
                        />
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{team.name}</span>
                        <span>•</span>
                        <span className="truncate">{p.busNumber?.split(' ')[0] || p.busNumber}</span>
                        <span>•</span>
                        <span className="font-mono text-zinc-500">รหัส {p.id}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      <span className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {isSelected ? '✓ เลือกแล้ว' : 'แตะเลือก'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
              ไม่พบรายชื่อที่ตรงกับ "{searchQuery}" โปรดลองเปลี่ยนคำค้นหา
            </div>
          )}
        </div>

        {/* Confirmation Footer Bar */}
        {confirmingPerson && (
          <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-bottom-2 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  ยืนยันตัวตนผู้ร่วมงาน
                </span>
                <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                  คุณคือ "{confirmingPerson.name}" ใช่หรือไม่?
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ระบบจะบันทึกชื่อนี้ลงในมือถือเครื่องนี้เพื่อเข้าใช้งานตลอดทริป
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingPerson(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  เลือกใหม่
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  ✓ ใช่ ยืนยันชื่อของฉัน
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
