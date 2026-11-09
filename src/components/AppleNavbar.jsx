import React from 'react';
import BrandLogo from './BrandLogo';
import {
  PassIcon,
  RouteIcon,
  BusIcon,
  GridPuzzleIcon,
  ChartIcon,
  ShieldLockIcon,
  SunIcon,
  MoonIcon,
} from './ui/Icons';

export default function AppleNavbar({
  activeTab,
  setActiveTab,
  participants,
  selectedId,
  setSelectedId,
  isDark,
  setIsDark,
  isAdminUnlocked,
  setIsAdminModalOpen,
}) {
  const categories = [
    { id: 'pass', name: 'บัตรดิจิทัล', Icon: PassIcon, desc: 'QR ประจำตัว' },
    { id: 'schedule', name: 'กำหนดการ', Icon: RouteIcon, desc: '25–26 ธ.ค. 69' },
    { id: 'bus', name: 'กิจกรรมบนรถ', Icon: BusIcon, desc: 'ควิซ & ทายเพลง' },
    { id: 'diff', name: 'เกมจับผิดภาพ', Icon: GridPuzzleIcon, desc: '10 ด่าน' },
    { id: 'leaderboard', name: 'คะแนน 10 สี', Icon: ChartIcon, desc: 'อัปเดตสด' },
    {
      id: 'admin',
      name: 'ผู้ดูแลระบบ',
      Icon: (props) => <ShieldLockIcon {...props} unlocked={isAdminUnlocked} />,
      desc: isAdminUnlocked ? 'ปลดล็อกแล้ว' : 'เฉพาะสตาฟ',
    },
  ];

  const handleCategoryClick = (catId) => {
    if (catId === 'admin' && !isAdminUnlocked) {
      setIsAdminModalOpen(true);
      return;
    }
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
              onClick={() => setActiveTab('pass')}
              className="flex items-center hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-all min-w-0"
            >
              <BrandLogo size="md" showSubtitle={true} />
            </button>
            <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">/</span>
            <span className="text-zinc-500 dark:text-zinc-400 hidden lg:inline text-xs font-medium truncate">
              KoniX (Thailand) Co., Ltd. • นครนายก
            </span>
          </div>

          {/* Right Controls: Participant Switcher & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] transition-colors max-w-[135px] xs:max-w-[165px] sm:max-w-[230px]">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:inline">ผู้ร่วมงาน:</span>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                aria-label="เลือกโปรไฟล์ผู้ร่วมงาน"
                className="bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer w-full truncate"
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
              aria-label="สลับโหมดสีหน้าจอ"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.08] transition-all shrink-0 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {isDark ? <SunIcon className="w-4 h-4 text-amber-400" /> : <MoonIcon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Domain-Specific Corporate Event Header */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                MEET THE JUNGLE • เดินป่า ส่องสัตว์
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.08]">
                KoniX (Thailand) Co., Ltd.
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              ระบบลงทะเบียน กิจกรรมสันทนาการ 10 สี และกำหนดการเดินทาง
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              25 – 26 ธันวาคม 2569 ณ โรงแรมสีดา รีสอร์ท จ.นครนายก • บริหารจัดการโดย บริษัท วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์ จำกัด
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ซิงค์ข้อมูลสด ({participants.length} ท่าน)
            </span>
          </div>
        </div>
      </section>

      {/* 3. Precision Segmented Navigation Shelf (Desktop & Tablet) */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max pb-1">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            const IconComponent = cat.Icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-150 border active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm'
                    : 'bg-white dark:bg-zinc-900/80 border-zinc-200/80 dark:border-white/[0.08] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/15 dark:bg-zinc-900/10 text-emerald-400 dark:text-emerald-600'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                }`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold leading-tight">
                    {cat.name}
                  </div>
                  <div className={`text-[10px] hidden xs:block leading-tight mt-0.5 ${
                    isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
