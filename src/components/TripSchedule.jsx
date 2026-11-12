import React, { useState } from 'react';
import itineraryMapImg from '../assets/itinerary_map.jpg';
import {
  RouteIcon,
  ClockIcon,
  ZoomInIcon,
  DownloadIcon,
  CheckCircleIcon,
} from './ui/Icons';

export default function TripSchedule() {
  const [activeModalImg, setActiveModalImg] = useState(null);

  const activeImg = itineraryMapImg;
  const activeTitle = 'แผนผังกำหนดการเดินทางและจุดแวะพัก ไป–กลับ (ฉบับเต็ม)';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* 1. Header Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 p-4 sm:p-7 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <RouteIcon className="w-4 h-4" />
              <span>MEET THE JUNGLE</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold font-mono tabular-nums bg-zinc-800 text-zinc-200 border border-zinc-700">
              <ClockIcon className="w-4 h-4 text-amber-400" />
              <span>25–26 ธ.ค. 2569 (2 วัน 1 คืน)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-zinc-50">
            กำหนดการเดินทางและตารางกิจกรรม
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-zinc-800 text-xs sm:text-sm text-zinc-300 font-medium">
            <div>
              <span className="font-bold text-white text-sm sm:text-base">บริษัท คอนิกซ์ (ไทยแลนด์) จำกัด</span>
              <span className="text-zinc-300 text-xs sm:text-sm block mt-0.5">
                KoniX (Thailand) Co., Ltd. • เส้นทาง: กรุงเทพฯ – โรงแรมสีดา รีสอร์ท นครนายก
              </span>
            </div>
            <div className="text-left sm:text-right text-xs sm:text-sm text-zinc-300">
              <span className="text-emerald-400 font-bold">บริหารการจัดงาน:</span> บจก. วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Schedule Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900/90 p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-50">
            {activeTitle}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setActiveModalImg(activeImg)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
          >
            <ZoomInIcon className="w-4 h-4 text-emerald-500" />
            <span>แตะดูภาพขยาย</span>
          </button>
          <a
            href={activeImg}
            download="konix_tour_schedule_map_2026.jpg"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>บันทึกภาพ</span>
          </a>
        </div>
      </div>

      {/* 3. Main High-Resolution Image Presentation (Front Page Visual Schedule) */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-3.5 sm:p-5 border border-zinc-200/90 dark:border-zinc-800 shadow-md space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            <span>ภาพความละเอียดสูง โครงการทัวร์ประจำปี 2569</span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            แตะที่ภาพเพื่อซูมขยายเต็มจอ
          </span>
        </div>

        {/* Clickable High-Resolution Visual Poster */}
        <div
          onClick={() => setActiveModalImg(activeImg)}
          className="relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 group cursor-zoom-in shadow-inner"
        >
          <img
            src={activeImg}
            alt={activeTitle}
            className="w-full h-auto object-contain max-h-[820px] mx-auto rounded-2xl group-hover:scale-[1.01] transition-transform duration-300"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg">
              <ZoomInIcon className="w-4 h-4 text-emerald-400" />
              <span>แตะเพื่อขยายภาพเต็มจอ</span>
            </span>
          </div>
        </div>

        {/* Quick Highlights Footer */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            <span>เอกสารทางการรับรองโดย บจก. วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์</span>
          </div>
          <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">ทัวร์นครนายก 25-26 ธันวาคม 2569</span>
        </div>
      </div>

      {/* 4. Fullscreen Lightbox Modal */}
      {activeModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalImg(null)}
        >
          {/* Modal Top Bar */}
          <div
            className="flex items-center justify-between p-3 text-white max-w-5xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold truncate">
                {activeTitle}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={activeModalImg}
                download="konix_tour_schedule_map_2026.jpg"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ดาวน์โหลด</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveModalImg(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                ปิด (✕)
              </button>
            </div>
          </div>

          {/* Zoomable Image View */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-2"
            onClick={() => setActiveModalImg(null)}
          >
            <img
              src={activeModalImg}
              alt="Schedule Full View"
              className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
