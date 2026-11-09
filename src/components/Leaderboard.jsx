import React, { useMemo } from 'react';
import { TEAM_COLORS } from '../utils/mockData';
import { UsersIcon, UtensilsIcon, TrophyIcon } from './ui/Icons';

export default function Leaderboard({ participants }) {
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

    participants.forEach(p => {
      if (map[p.teamColor]) {
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

  const totalParticipants = participants.length;
  const totalFoodClaimed = participants.filter(p => p.foodClaimed).length;
  const totalContestants = participants.filter(p => p.joinEveningContest === 'yes').length;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      
      {/* Scoreboard Header Banner */}
      <div className="relative rounded-3xl p-5 sm:p-8 overflow-hidden bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>LIVE STANDINGS • 10 TEAMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              ตารางคะแนนการแข่งขัน 10 สี
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
              สรุปคะแนนสะสมจากกิจกรรมบนรถบัส เกมจับผิดภาพ และคะแนนภารกิจทีมจากสตาฟฟ์
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ซิงค์ข้อมูลอัตโนมัติ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900/90 p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs sm:text-sm font-semibold">ผู้ร่วมงานทั้งหมด</span>
            <UsersIcon className="w-4 h-4 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 mt-1.5 tracking-tight">
            {totalParticipants}{' '}
            <span className="text-xs sm:text-sm font-sans text-zinc-500 font-medium">คน</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs sm:text-sm font-semibold">รับอาหารเช้าแล้ว</span>
            <UtensilsIcon className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1.5 tracking-tight">
            {totalFoodClaimed}{' '}
            <span className="text-xs sm:text-sm font-sans text-zinc-500 font-medium">คน</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs sm:text-sm font-semibold">ลงประกวดชุดค่ำ</span>
            <TrophyIcon className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-1.5 tracking-tight">
            {totalContestants}{' '}
            <span className="text-xs sm:text-sm font-sans text-zinc-500 font-medium">คน</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-1">
        
        {/* 2nd Place */}
        {teamStats[1] && (
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 sm:w-11 sm:h-11 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              2nd
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white shadow-xs max-w-full truncate"
              style={{ backgroundColor: teamStats[1].hex }}
            >
              <span className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
              <span className="truncate">{teamStats[1].name}</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 tracking-tight">
              {teamStats[1].totalScore}{' '}
              <span className="text-[11px] sm:text-xs font-sans text-zinc-500 font-medium">แต้ม</span>
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-mono tabular-nums block truncate">
              สมาชิก {teamStats[1].memberCount} คน
            </span>
          </div>
        )}

        {/* 1st Place */}
        {teamStats[0] && (
          <div className="bg-white dark:bg-zinc-900 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-center space-y-2.5 shadow-md -translate-y-1.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white shadow-xs max-w-full truncate"
              style={{ backgroundColor: teamStats[0].hex }}
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0" />
              <span className="truncate">{teamStats[0].name}</span>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400 tracking-tight">
              {teamStats[0].totalScore}{' '}
              <span className="text-xs sm:text-sm font-sans text-zinc-500 font-medium">แต้ม</span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block truncate">
              อันดับ 1 ปัจจุบัน
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {teamStats[2] && (
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 sm:w-11 sm:h-11 mx-auto rounded-xl bg-amber-900/10 dark:bg-amber-900/20 border border-amber-700/30 flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm text-amber-800 dark:text-amber-400">
              3rd
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white shadow-xs max-w-full truncate"
              style={{ backgroundColor: teamStats[2].hex }}
            >
              <span className="w-2 h-2 rounded-full bg-white/80 shrink-0" />
              <span className="truncate">{teamStats[2].name}</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 tracking-tight">
              {teamStats[2].totalScore}{' '}
              <span className="text-[11px] sm:text-xs font-sans text-zinc-500 font-medium">แต้ม</span>
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-mono tabular-nums block truncate">
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
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              เรียงลำดับตามคะแนนสะสมรวมของสมาชิกในแต่ละทีม
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums font-bold text-zinc-500 dark:text-zinc-400">
            MAX {maxScore} PTS
          </span>
        </div>

        <div className="space-y-2.5">
          {teamStats.map((team, rank) => {
            const barWidth = Math.max(Math.round((team.totalScore / maxScore) * 100), 4);
            const isTop1 = rank === 0;

            return (
              <div
                key={team.id}
                className={`p-3.5 sm:p-4 rounded-2xl transition-colors border ${
                  isTop1
                    ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border-amber-500/30'
                    : 'bg-zinc-50/70 dark:bg-zinc-950/50 border-zinc-200/60 dark:border-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-sm sm:text-base mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono tabular-nums ${
                        isTop1
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {rank + 1}
                    </div>

                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: team.hex }}
                    />

                    <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                      {team.name}
                    </span>

                    <span className="text-xs text-zinc-500 font-mono tabular-nums hidden xs:inline">
                      ({team.memberCount} คน)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold font-mono tabular-nums text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                      {team.totalScore}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">แต้ม</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-full overflow-hidden">
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
