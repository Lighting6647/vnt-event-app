import React from 'react';
import BrandLogo from './BrandLogo';
import { TEAM_COLORS, findParticipantById } from '../utils/mockData';
import {
  PassIcon,
  RouteIcon,
  ChartIcon,
  SunIcon,
  MoonIcon,
} from './ui/Icons';

export default function AppleNavbar({
  activeTab,
  setActiveTab,
  participants,
  currentParticipant,
  selectedId,
  isDark,
  setIsDark,
  onOpenSwitchUser,
}) {
  const currentPerson = currentParticipant || (selectedId ? findParticipantById(participants, selectedId) : null);
  const team = (currentPerson && TEAM_COLORS.find(t => t.id === currentPerson.teamColor)) || TEAM_COLORS[0];

  // Public Categories: strictly attendee-facing tabs (No Admin in public shelf)
  const categories = [
    { id: 'schedule', name: 'กำหนดการ', Icon: RouteIcon, desc: '25–26 ธ.ค. 69' },
    { id: 'pass', name: 'บัตรดิจิทัล', Icon: PassIcon, desc: 'QR ประจำตัว' },
    { id: 'leaderboard', name: 'คะแนน 10 สี', Icon: ChartIcon, desc: 'อัปเดตสด' },
  ];

  const handleCategoryClick = (catId) => {
    setActiveTab(catId);
  };

  return (
    <div className="w-full">
      {/* 1. Precision Glass Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-white/[0.08] transition-colors py-2 sm:py-2.5">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 text-xs">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('pass')}
              className="flex items-center hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-all min-w-0 cursor-pointer"
              title="VNT Event App"
            >
              <BrandLogo size="md" showSubtitle={true} />
            </button>
            <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">/</span>
            <span className="text-zinc-500 dark:text-zinc-400 hidden lg:inline text-xs font-medium truncate">
              KoniX (Thailand) Co., Ltd. • นครนายก
            </span>
          </div>

          {/* Right Controls: Attendee Own Identity Badge (No Public Search Bar) & Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Attendee Personal Identity Locked Badge (Read-Only: Admin Only Can Change) */}
            <div
              className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] select-none shadow-xs text-left"
              title={currentPerson ? `บัตรของคุณ: ${currentPerson.name} (หากต้องการแก้ไขข้อมูลหรือเปลี่ยนชื่อ กรุณาติดต่อ Admin)` : 'ยังไม่ได้ระบุตัวตน'}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: team?.hex || '#10b981' }}
              />
              <span className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 truncate max-w-[130px] xs:max-w-[170px] sm:max-w-[220px]">
                {currentPerson ? currentPerson.name : 'ยังไม่ระบุชื่อ'}
              </span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                {currentPerson ? currentPerson.id : '---'}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline" title="ล็อคตัวตนแล้ว ติดต่อ Admin เพื่อแก้ไข">
                🔒
              </span>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
              aria-label="สลับโหมดสีหน้าจอ"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.08] transition-all shrink-0 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              {isDark ? <SunIcon className="w-4 h-4 text-amber-400" /> : <MoonIcon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Domain-Specific Corporate Event Header */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                MEET THE JUNGLE • เดินป่า ส่องสัตว์
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.08]">
                KoniX (Thailand) Co., Ltd.
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              ระบบลงทะเบียน กิจกรรมสันทนาการ 10 สี และกำหนดการเดินทาง
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl font-medium">
              25 – 26 ธันวาคม 2569 ณ โรงแรมสีดา รีสอร์ท จ.นครนายก • บริหารจัดการโดย บริษัท วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์ จำกัด
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ซิงค์ข้อมูลสด ({participants.length} ท่าน)
            </span>
          </div>
        </div>
      </section>

      {/* 3. Precision Segmented Navigation Shelf (Desktop & Tablet) - Hidden on Admin Page */}
      {activeTab !== 'admin' && (
        <section className="max-w-6xl mx-auto px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              const IconComponent = cat.Icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl transition-all duration-150 border active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-md'
                      : 'bg-white dark:bg-zinc-900/80 border-zinc-200/80 dark:border-white/[0.08] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200'
                  }`}
                >
                  <span className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-white/15 dark:bg-zinc-900/10 text-emerald-400 dark:text-emerald-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </span>
                  <div className="text-left">
                    <div className="text-sm sm:text-base font-extrabold leading-tight">
                      {cat.name}
                    </div>
                    <div className={`text-xs hidden xs:block leading-tight mt-0.5 font-medium ${
                      isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {cat.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
