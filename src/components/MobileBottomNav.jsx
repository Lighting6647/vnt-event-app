import React from 'react';
import { playTick } from '../utils/soundEffects';
import {
  PassIcon,
  RouteIcon,
  BusIcon,
  GridPuzzleIcon,
  ChartIcon,
  ShieldLockIcon,
} from './ui/Icons';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  isAdminUnlocked,
  setIsAdminModalOpen,
}) {
  const tabs = [
    { id: 'schedule', name: 'กำหนดการ', Icon: RouteIcon },
    { id: 'pass', name: 'บัตร', Icon: PassIcon },
    { id: 'leaderboard', name: 'คะแนน', Icon: ChartIcon },
    { id: 'admin', name: 'Admin', Icon: ShieldLockIcon, unlocked: isAdminUnlocked },
  ];

  const handleTabClick = (tabId) => {
    playTick();
    if (tabId === 'admin' && !isAdminUnlocked) {
      setIsAdminModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sm:hidden fixed bottom-2 left-2 right-2 z-50 max-w-md mx-auto pointer-events-auto">
      <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-1 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.75)] flex items-center justify-around pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.Icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-1.5 px-0.5 rounded-xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-manipulation select-none min-h-[46px] ${
                isActive
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <IconComponent
                unlocked={tab.unlocked}
                className={`w-4 h-4 xs:w-[18px] xs:h-[18px] transition-transform ${
                  isActive
                    ? 'text-emerald-400 dark:text-emerald-600 scale-105'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              />
              <span className="text-[9.5px] xs:text-[10.5px] font-bold mt-1 leading-none whitespace-nowrap">
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
