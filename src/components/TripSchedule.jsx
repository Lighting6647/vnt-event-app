import React, { useState } from 'react';
import itineraryMapImg from '../assets/itinerary_map.jpg';
import itineraryDetailsImg from '../assets/itinerary_details.jpg';
import {
  RouteIcon,
  ClockIcon,
  ZoomInIcon,
  FileTextIcon,
  DownloadIcon,
  CheckCircleIcon,
} from './ui/Icons';

export default function TripSchedule({ onNavigateTab }) {
  const [selectedView, setSelectedView] = useState('details'); // 'details' or 'map'
  const [activeModalImg, setActiveModalImg] = useState(null);

  const activeImg = selectedView === 'details' ? itineraryDetailsImg : itineraryMapImg;
  const activeTitle = selectedView === 'details' ? 'ใบกำหนดการเดินทาง 2 วัน 1 คืน (ฉบับเต็ม)' : 'แผนผังเส้นทางและจุดแวะพัก ไป–กลับ';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* 1. Header Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 p-4 sm:p-7 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <RouteIcon className="w-3.5 h-3.5" />
              <span>MEET THE JUNGLE</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold font-mono tabular-nums bg-zinc-800 text-zinc-300 border border-zinc-700">
              <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>25–26 ธ.ค. 2569 (2 วัน 1 คืน)</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight text-zinc-50">
            กำหนดการเดินทางและตารางกิจกรรม
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-zinc-800 text-xs sm:text-sm text-zinc-300">
            <div>
              <span className="font-bold text-white">บริษัท คอนิกซ์ (ไทยแลนด์) จำกัด</span>
              <span className="text-zinc-400 text-[11px] sm:text-xs block">
                KoniX (Thailand) Co., Ltd. • เส้นทาง: กรุงเทพฯ – โรงแรมสีดา รีสอร์ท นครนายก
              </span>
            </div>
            <div className="text-left sm:text-right text-[11px] sm:text-xs text-zinc-400">
              <span className="text-emerald-400 font-semibold">บริหารการจัดงาน:</span> บจก. วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Schedule Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900/90 p-2 sm:p-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedView('details')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedView === 'details'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileTextIcon className="w-4 h-4 text-emerald-500" />
            <span>ใบกำหนดการ 2 วัน 1 คืน</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('map')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedView === 'map'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <RouteIcon className="w-4 h-4 text-sky-500" />
            <span>แผนที่เส้นทาง & จุดแวะพัก</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setActiveModalImg(activeImg)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
          >
            <ZoomInIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>แตะดูภาพขยาย</span>
          </button>
          <a
            href={activeImg}
            download={selectedView === 'details' ? 'konix_tour_schedule_2026.jpg' : 'konix_tour_map_2026.jpg'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span>บันทึกภาพ</span>
          </a>
        </div>
      </div>

      {/* 3. Main High-Resolution Image Presentation (Front Page Visual Schedule) */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-3 sm:p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-md space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {activeTitle}
          </span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            แตะที่ภาพเพื่อซูมขยายเต็มจอ
          </span>
        </div>

        {/* Clickable High-Resolution Visual Poster */}
        <div
          onClick={() => setActiveModalImg(activeImg)}
          className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 cursor-zoom-in group transition-all"
        >
          <img
            src={activeImg}
            alt={activeTitle}
            className="w-full h-auto object-contain max-h-[820px] mx-auto rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="px-4 py-2 rounded-xl bg-zinc-950/80 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
              <ZoomInIcon className="w-4 h-4 text-emerald-400" />
              <span>แตะเพื่อขยายภาพฉบับเต็ม</span>
            </span>
          </div>
        </div>

        {/* Quick Highlights Footer */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            <span>เอกสารทางการรับรองโดย บจก. วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์</span>
          </div>
          <span className="font-mono text-[11px]">ทัวร์นครนายก 25-26 ธันวาคม 2569</span>
        </div>
      </div>

      {/* 4. Fullscreen Zoom Modal */}
      {activeModalImg && (
        <div 
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-4xl max-h-[94vh] overflow-auto rounded-2xl bg-zinc-900 p-2 sm:p-3 border border-zinc-700 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveModalImg(null)}
              aria-label="ปิดหน้าต่างขยายภาพ"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white flex items-center justify-center text-sm font-bold border border-zinc-700 shadow-md transition-colors cursor-pointer"
            >
              ✕
            </button>
            <img 
              src={activeModalImg} 
              alt="ภาพกำหนดการขยายใหญ่" 
              className="w-full h-auto rounded-xl object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}

    </div>
  );
}
