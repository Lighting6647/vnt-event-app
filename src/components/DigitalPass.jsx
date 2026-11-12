import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { TEAM_COLORS } from '../utils/mockData';
import { useWakeLock } from '../utils/useWakeLock';
import { cachePassOffline, getCachedPass, isBrowserOnline } from '../utils/offlinePassStorage';
import {
  RouteIcon,
  BusIcon,
  UtensilsIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChevronRightIcon,
} from './ui/Icons';

export default function DigitalPass({ participant, onOpenActivity, onOpenSchedule }) {
  const [qrUrl, setQrUrl] = useState('');
  const [serverLanUrl, setServerLanUrl] = useState('');
  const { isLocked, isSupported } = useWakeLock(true);
  const [isOnline, setIsOnline] = useState(() => isBrowserOnline());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const team = (participant && TEAM_COLORS.find(t => t.id === participant.teamColor)) || TEAM_COLORS[0] || { name: 'สีทีม', hex: '#10b981', textHex: '#ffffff' };

  useEffect(() => {
    fetch('/api/server-info')
      .then(res => res.json())
      .then(info => {
        if (info.lanUrl) {
          setServerLanUrl(info.lanUrl);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    if (participant?.id) {
      // Determine the best base URL for smartphone QR code scan:
      // If client is currently browsing via localhost, use server's actual LAN IP so mobile can reach it
      let baseUrl = window.location.origin;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (serverLanUrl) {
          baseUrl = serverLanUrl;
        }
      }

      const smartUrl = `${baseUrl}/?user=${encodeURIComponent(participant.id)}&tab=pass`;

      QRCode.toDataURL(smartUrl, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#09090b',
          light: '#ffffff',
        },
      })
        .then(url => {
          if (active) {
            setQrUrl(url);
            cachePassOffline(participant, url);
          }
        })
        .catch(err => {
          console.error('QR Error:', err);
          const cached = getCachedPass(participant?.id);
          if (cached?.qrDataUrl && active) {
            setQrUrl(cached.qrDataUrl);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [participant, serverLanUrl]);

  if (!participant) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-zinc-500">
          กรุณาเลือกรายชื่อผู้ร่วมงานจากเมนูด้านบน
        </div>
      </div>
    );
  }

  const foodTime = participant.foodClaimedAt
    ? new Date(participant.foodClaimedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      
      {/* Precision Digital Tour Pass */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300">
        
        {/* Team Accent Top Strip */}
        <div className="h-3 w-full" style={{ backgroundColor: team.hex }} />

        {/* Card Content */}
        <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
          
          {/* Trip Theme & Company Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Meet the Jungle • 2 วัน 1 คืน
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
              KoniX (Thailand) Co., Ltd.
            </span>
          </div>

          {/* Smartphone Telemetry: Live Sync, Offline Resilience & Screen Wake Lock */}
          <div className="flex items-center justify-between text-[11px] font-medium py-0.5 px-0.5 text-zinc-400">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync (เชื่อมต่อสด)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                โหมดออฟไลน์ (บัตรพร้อมสแกน)
              </span>
            )}

            {isSupported && isLocked && (
              <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-mono text-[10px]">
                <span>💡 จอสว่างตลอด</span>
              </span>
            )}
          </div>

          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
                PASS • 25–26 DEC 2569
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-0.5 truncate">
                {participant?.name || 'ไม่ระบุชื่อ'}
              </h2>
              <span className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                ID: {participant?.id || '-'}
              </span>
            </div>

            <div
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 shrink-0"
              style={{ backgroundColor: team?.hex || '#10b981', color: team?.textHex || '#ffffff' }}
            >
              <span className="w-2 h-2 rounded-full bg-white/90" />
              {team?.name || 'ทีมสี'}
            </div>
          </div>

          {/* Quick Metrics: Bus & Meal Status */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Bus Info */}
            <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 p-3.5 sm:p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <BusIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-semibold">รถบัสประจำตัว</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1.5 line-clamp-2">
                {participant.busNumber}
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1 block">
                ขึ้นรถคันตนเองเท่านั้น
              </span>
            </div>

            {/* Meal Status */}
            <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <UtensilsIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-semibold">สิทธิ์อาหารเช้า</span>
              </div>
              {participant.foodClaimed ? (
                <div className="mt-1.5">
                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                    <span>รับอาหารแล้ว</span>
                  </div>
                  <span className="text-xs text-zinc-500 block font-mono tabular-nums font-semibold mt-0.5">
                    เวลา {foodTime} น.
                  </span>
                </div>
              ) : (
                <div className="mt-1.5">
                  <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
                    รอสแกนรับสิทธิ์
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono tabular-nums block mt-0.5">
                    07:00–08:00 น.
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* QR Code Verification Box */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 p-5 sm:p-6 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-zinc-200/80">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QR Code สำหรับ ${participant?.name || 'ผู้ร่วมงาน'}`}
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                />
              ) : (
                <div
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                  aria-label="กำลังสร้างรหัส QR"
                />
              )}
            </div>
            
            <div className="text-center">
              <span className="text-base font-mono tabular-nums font-bold text-zinc-900 dark:text-zinc-100">
                {participant.id}
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                แสดงรหัสนี้ต่อทีมงานเพื่อเช็คชื่อ รับอาหารเช้า และสะสมคะแนนสี
              </p>
            </div>
          </div>

          {/* Score & Contest Quick Info */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80">
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-semibold">คะแนนสะสมบุคคล</span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-zinc-900 dark:text-zinc-50">
                {participant.score || 0}{' '}
                <span className="text-xs font-sans text-zinc-500 font-semibold">แต้ม</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-semibold">ประกวดชุดงานเลี้ยงค่ำ</span>
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {participant.joinEveningContest === 'yes' ? (
                  <>
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>ลงทะเบียนประกวดแล้ว</span>
                  </>
                ) : (
                  <span className="text-zinc-500 font-medium">ไม่ได้ลงประกวด</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {onOpenSchedule && (
              <button
                onClick={onOpenSchedule}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-bold shadow-xs transition-all flex items-center justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <RouteIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  <span>ดูกำหนดการเดินทาง 2 วัน 1 คืน</span>
                </span>
                <ChevronRightIcon className="w-4 h-4 opacity-70" />
              </button>
            )}

            <button
              onClick={() => onOpenActivity(participant)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-xs transition-all flex items-center justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <span>ลงทะเบียนประกวดชุดแฟนซี (ธีมท่องป่า)</span>
              <ChevronRightIcon className="w-4 h-4 opacity-80" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
