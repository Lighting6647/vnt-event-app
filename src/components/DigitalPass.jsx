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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-zinc-600 dark:text-zinc-300 text-base font-semibold">
          กรุณาเลือกรายชื่อผู้ร่วมงานจากเมนูด้านบน
        </div>
      </div>
    );
  }

  const foodTime = participant.foodClaimedAt
    ? new Date(participant.foodClaimedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="max-w-md mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      
      {/* Precision Digital Tour Pass */}
      <div className="bg-white dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 rounded-[30px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
        
        {/* Team Accent Top Strip */}
        <div className="h-3.5 w-full" style={{ backgroundColor: team.hex }} />

        {/* Card Content */}
        <div className="p-4 sm:p-7 space-y-5">
          
          {/* Trip Theme & Company Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Meet the Jungle • 2 วัน 1 คืน
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 truncate">
              KoniX (Thailand) Co., Ltd.
            </span>
          </div>

          {/* Smartphone Telemetry: Live Sync & Wake Lock */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold py-0.5 px-0.5 text-zinc-600 dark:text-zinc-300">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync (เชื่อมต่อข้อมูลสด)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                โหมดออฟไลน์ (บัตรพร้อมสแกน)
              </span>
            )}

            {isSupported && isLocked && (
              <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-mono text-xs">
                <span>💡 จอสว่างตลอด</span>
              </span>
            )}
          </div>

          {/* Header Row: Attendee Name & Team Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono block">
                PASS • 25–26 DEC 2569
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mt-1 truncate">
                {participant?.name || 'ไม่ระบุชื่อ'}
              </h2>
              <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-zinc-600 dark:text-zinc-300 block mt-0.5">
                รหัสพนักงาน: {participant?.id || '-'}
              </span>
            </div>

            <div
              className="px-4 py-2 rounded-full text-sm sm:text-base font-black shadow-md flex items-center gap-2 shrink-0"
              style={{ backgroundColor: team?.hex || '#10b981', color: team?.textHex || '#ffffff' }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              {team?.name || 'ทีมสี'}
            </div>
          </div>

          {/* Quick Metrics: Bus & Meal Status */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Bus Info */}
            <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                <BusIcon className="w-4 h-4 shrink-0 text-sky-500" />
                <span className="text-xs sm:text-sm font-bold">รถบัสประจำตัว</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-2 line-clamp-2 leading-snug">
                {participant.busNumber}
              </div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 block font-semibold">
                ขึ้นรถคันตนเองเท่านั้น
              </span>
            </div>

            {/* Meal Status */}
            <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                <UtensilsIcon className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="text-xs sm:text-sm font-bold">สิทธิ์อาหารเช้า</span>
              </div>
              {participant.foodClaimed ? (
                <div className="mt-2">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                    <span>รับอาหารแล้ว</span>
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 block font-mono tabular-nums font-bold mt-1">
                    เวลา {foodTime} น.
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400">
                    รอสแกนรับสิทธิ์
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-mono tabular-nums block font-bold mt-1">
                    เวลา 07:00–08:00 น.
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* QR Code Verification Box */}
          <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QR Code สำหรับ ${participant?.name || 'ผู้ร่วมงาน'}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div
                  className="w-48 h-48 sm:w-52 sm:h-52 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                  aria-label="กำลังสร้างรหัส QR"
                />
              )}
            </div>
            
            <div className="text-center space-y-1">
              <span className="text-lg sm:text-xl font-mono tabular-nums font-black text-zinc-900 dark:text-zinc-100 tracking-wider">
                {participant.id}
              </span>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-bold max-w-xs mx-auto leading-relaxed">
                ยื่น QR ให้ทีมงานสแกนเพื่อเช็คชื่อ รับอาหารเช้า และเติมคะแนนสะสมสี
              </p>
            </div>
          </div>

          {/* Score & Contest Quick Info */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 block font-bold">คะแนนสะสมบุคคล</span>
              <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-zinc-900 dark:text-zinc-50">
                {participant.score || 0}{' '}
                <span className="text-sm font-sans text-zinc-500 dark:text-zinc-400 font-bold">แต้ม</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 block font-bold">ประกวดชุดงานเลี้ยงค่ำ</span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {participant.joinEveningContest === 'yes' ? (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>ลงทะเบียนแล้ว</span>
                  </>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">ไม่ได้ลงประกวด</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-1">
            {onOpenSchedule && (
              <button
                onClick={onOpenSchedule}
                className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm sm:text-base font-extrabold shadow-sm transition-all flex items-center justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <RouteIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  <span>ดูกำหนดการเดินทาง 2 วัน 1 คืน</span>
                </span>
                <ChevronRightIcon className="w-4 h-4 opacity-75" />
              </button>
            )}

            <button
              onClick={() => onOpenActivity(participant)}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm sm:text-base font-extrabold shadow-md shadow-emerald-900/30 transition-all flex items-center justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <span>ลงทะเบียนประกวดชุดแฟนซี (ธีมท่องป่า)</span>
              <ChevronRightIcon className="w-4 h-4 opacity-85" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
