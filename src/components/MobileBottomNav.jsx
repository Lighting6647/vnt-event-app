import React from 'react';
import { playTick } from '../utils/soundEffects';
import {
  PassIcon,
  RouteIcon,
  ChartIcon,
} from './ui/Icons';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  isAdminUnlocked,
  setIsAdminModalOpen,
}) {
  const tabs = [
    { id: 'schedule', name: 'กำหนดการ', Icon: RouteIcon },
    { id: 'pass', name: 'บัตรประจำตัว', Icon: PassIcon },
    { id: 'leaderboard', name: 'คะแนน 10 สี', Icon: ChartIcon },
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
      <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.75)] flex items-center justify-around pb-[max(0.35rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.Icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 touch-manipulation select-none min-h-[50px] cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 transition-transform ${
                  isActive
                    ? 'text-emerald-400 dark:text-emerald-600 scale-110'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              />
              <span className="text-xs font-bold mt-1 leading-tight whitespace-nowrap">
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
