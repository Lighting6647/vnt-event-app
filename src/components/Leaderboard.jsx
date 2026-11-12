import React, { useMemo, useState } from 'react';
import { TEAM_COLORS } from '../utils/mockData';
import { TrophyIcon, SearchIcon, XIcon } from './ui/Icons';

export default function Leaderboard({ participants }) {
  const [searchQuery, setSearchQuery] = useState('');

  const teamStats = useMemo(() => {
    const map = {};
    TEAM_COLORS.forEach(t => {
      map[t.id] = {
        ...t,
        totalScore: 0,
        memberCount: 0,
        foodClaimedCount: 0,
      };
    });

    (participants || []).forEach(p => {
      if (p && p.teamColor && map[p.teamColor]) {
        map[p.teamColor].totalScore += p.score || 0;
        map[p.teamColor].memberCount += 1;
        if (p.foodClaimed) {
          map[p.teamColor].foodClaimedCount += 1;
        }
      }
    });

    return Object.values(map).sort((a, b) => b.totalScore - a.totalScore);
  }, [participants]);

  const maxScore = Math.max(...teamStats.map(t => t.totalScore), 100);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return (participants || []).filter((p) => {
      if (!p) return false;
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.teamColor && p.teamColor.toLowerCase().includes(q)) ||
        (p.busNumber && p.busNumber.toLowerCase().includes(q))
      );
    });
  }, [participants, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      
      {/* Scoreboard Header Banner */}
      <div className="relative rounded-3xl p-5 sm:p-8 overflow-hidden bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>LIVE STANDINGS • 10 TEAMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              ตารางคะแนนการแข่งขัน 10 สี
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-xl font-medium">
              สรุปคะแนนสะสมแบบเรียลไทม์ และค้นหาคะแนนรายบุคคลหรือทีมสีได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ซิงค์ข้อมูลอัตโนมัติ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgraded Search Hub (Elder-Friendly Sizing) */}
      <div className="bg-white dark:bg-zinc-900/90 p-4 sm:p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3.5">
        <div className="relative w-full">
          <SearchIcon className="w-5 h-5 text-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาคะแนน: พิมพ์ชื่อพนักงาน, รหัส, ทีมสี หรือคันรถ..."
            className="w-full pl-12 pr-10 py-3 text-sm sm:text-base font-medium bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer p-1"
            >
              <XIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Live Search Results Display */}
        {searchQuery.trim() && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
            <div className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>ผลการค้นหา ({filteredParticipants.length} รายการ)</span>
              <span className="text-xs text-zinc-500 font-medium">พิมพ์ชื่อหรือรหัสเพื่อเจาะจง</span>
            </div>

            {filteredParticipants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredParticipants.map((p) => {
                  const team = TEAM_COLORS.find((t) => t.id === p.teamColor) || { name: p.teamColor, hex: '#10b981' };
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {p.name}
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mt-1 font-medium">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: team.hex }}
                          />
                          <span className="font-semibold truncate">{team.name}</span>
                          <span>•</span>
                          <span className="font-mono font-bold">{p.id}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {p.score || 0}
                        </div>
                        <div className="text-xs text-zinc-500 font-semibold">คะแนน</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                ไม่พบรายชื่อหรือทีมสีที่ตรงกับคำค้นหา "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-1">
        
        {/* 2nd Place */}
        {teamStats[1] && (
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center space-y-2 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              2nd
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white shadow-xs max-w-full truncate"
              style={{ backgroundColor: teamStats[1].hex }}
            >
              <span className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
              <span className="truncate">{teamStats[1]?.name || 'สีทีม'}</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 tracking-tight">
              {teamStats[1]?.totalScore || 0}{' '}
              <span className="text-xs sm:text-sm font-sans text-zinc-500 font-semibold">แต้ม</span>
            </div>
            <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono font-semibold tabular-nums block truncate">
              สมาชิก {teamStats[1]?.memberCount || 0} คน
            </span>
          </div>
        )}

        {/* 1st Place */}
        {teamStats[0] && (
          <div className="bg-white dark:bg-zinc-900 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-center space-y-2.5 shadow-md -translate-y-1.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-white shadow-xs max-w-full truncate"
              style={{ backgroundColor: teamStats[0].hex }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
              <span className="truncate">{teamStats[0]?.name || 'สีทีม'}</span>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400 tracking-tight">
              {teamStats[0]?.totalScore || 0}{' '}
              <span className="text-xs sm:text-sm font-sans text-zinc-600 dark:text-zinc-300 font-semibold">แต้ม</span>
            </div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block truncate">
              อันดับ 1 ปัจจุบัน
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {teamStats[2] && (
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center space-y-2 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto rounded-xl bg-amber-900/10 dark:bg-amber-900/20 border border-amber-700/30 flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm text-amber-800 dark:text-amber-400">
              3rd
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white shadow-xs max-w-full truncate"
              style={{ backgroundColor: teamStats[2].hex }}
            >
              <span className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
              <span className="truncate">{teamStats[2]?.name || 'สีทีม'}</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 tracking-tight">
              {teamStats[2]?.totalScore || 0}{' '}
              <span className="text-xs sm:text-sm font-sans text-zinc-500 font-semibold">แต้ม</span>
            </div>
            <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono font-semibold tabular-nums block truncate">
              สมาชิก {teamStats[2].memberCount} คน
            </span>
          </div>
        )}

      </div>

      {/* 10 Colors Rank Table */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-4 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              อันดับคะแนนรวมทั้ง 10 สี
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              เรียงลำดับตามคะแนนสะสมรวมของสมาชิกในแต่ละทีม
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono tabular-nums font-bold text-zinc-600 dark:text-zinc-400">
            MAX {maxScore} PTS
          </span>
        </div>

        <div className="space-y-3">
          {teamStats.map((team, rank) => {
            const barWidth = Math.max(Math.round((team.totalScore / maxScore) * 100), 4);
            const isTop1 = rank === 0;

            return (
              <div
                key={team.id}
                className={`p-3.5 sm:p-4 rounded-2xl transition-colors border ${
                  isTop1
                    ? 'bg-amber-500/[0.05] dark:bg-amber-500/[0.08] border-amber-500/40 shadow-xs'
                    : 'bg-zinc-50/70 dark:bg-zinc-950/50 border-zinc-200/60 dark:border-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-sm sm:text-base mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm font-mono tabular-nums ${
                        isTop1
                          ? 'bg-amber-500 text-zinc-950 shadow-xs'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {rank + 1}
                    </div>

                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: team.hex }}
                    />

                    <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                      {team?.name || 'สีทีม'}
                    </span>

                    <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono font-medium tabular-nums hidden xs:inline">
                      ({team.memberCount} คน)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-black font-mono tabular-nums text-base sm:text-xl text-zinc-900 dark:text-zinc-100">
                      {team.totalScore}
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-500 font-semibold">แต้ม</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: team.hex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
