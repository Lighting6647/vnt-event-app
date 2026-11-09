import React, { useState, useRef, useEffect } from 'react';
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
  SearchIcon,
  XIcon,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredParticipants = searchQuery.trim()
    ? participants.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q) ||
          p.busNumber?.toLowerCase().includes(q) ||
          p.teamColor?.toLowerCase().includes(q)
        );
      })
    : participants;

  const currentPerson = participants.find((p) => p.id === selectedId) || participants[0];

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

          {/* Right Controls: Participant Quick Search & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Search Popover */}
            <div className="relative" ref={searchDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] transition-all max-w-[150px] xs:max-w-[190px] sm:max-w-[260px] text-left cursor-pointer"
              >
                <SearchIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div className="min-w-0 flex-1 truncate">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                    {currentPerson ? `${currentPerson.name}` : 'เลือกผู้ร่วมงาน'}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline shrink-0">
                  {currentPerson?.id}
                </span>
              </button>

              {/* Search Dropdown Modal */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-84 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative mb-2">
                    <SearchIcon className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="ค้นหาชื่อ, รหัส, คันรถ (เช่น คันที่ 2)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((p) => {
                        const isSelected = p.id === selectedId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedId(p.id);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20'
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{p.name}</div>
                              <div className="text-[10px] text-zinc-400 truncate">
                                {p.busNumber} • ทีม{p.teamColor}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono shrink-0 ml-2 px-1.5 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-800">
                              {p.id}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="py-4 text-center text-xs text-zinc-400">
                        ไม่พบข้อมูลที่ตรงกับการค้นหา
                      </div>
                    )}
                  </div>
                </div>
              )}
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
