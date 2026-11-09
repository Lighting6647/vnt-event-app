import React from 'react';
import vntLogo from '../assets/vnt_logo.jpg';

export default function BrandLogo({ size = 'md', showSubtitle = true, className = '' }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  
  const imgBoxSize = isSmall
    ? 'w-9 h-9'
    : isLarge
    ? 'w-14 h-14 sm:w-20 sm:h-20'
    : 'w-11 h-11 sm:w-14 sm:h-14';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      {/* Official VNT Medallion with Specular Ring */}
      <div className={`relative ${imgBoxSize} shrink-0 rounded-full bg-white p-0.5 sm:p-1 shadow-[0_2px_12px_rgba(0,0,0,0.24)] ring-1 ring-black/10 dark:ring-white/20 group hover:scale-[1.02] transition-transform duration-200`}>
        <img
          src={vntLogo}
          alt="VNT Event Organizer Co., Ltd."
          className="w-full h-full object-contain rounded-full select-none"
        />
      </div>

      {/* Corporate Typography */}
      <div className="flex flex-col text-left justify-center min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
            VNT EVENT
          </span>
          <span className="inline-block px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 whitespace-nowrap">
            KONIX 2026
          </span>
        </div>
        
        {showSubtitle && (
          <div className="flex flex-col mt-0.5 min-w-0">
            <span className="text-[10px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-tight truncate max-w-[130px] xs:max-w-[170px] sm:max-w-none">
              บจก. วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
