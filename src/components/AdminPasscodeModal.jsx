import React, { useState } from 'react';
import { playSuccess, playWarning } from '../utils/soundEffects';
import { ShieldLockIcon } from './ui/Icons';

export default function AdminPasscodeModal({ isOpen, onClose, onUnlock }) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const CORRECT_PASSWORDS = ['2026', '1234', 'admin2026'];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (CORRECT_PASSWORDS.includes(passcode.trim())) {
      playSuccess();
      setErrorMsg('');
      onUnlock();
      onClose();
    } else {
      playWarning();
      setErrorMsg('รหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6 text-center transition-transform ${
          isShaking ? 'translate-x-[-8px]' : ''
        }`}
      >
        {/* Vector Lock Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shadow-xs">
          <ShieldLockIcon unlocked={false} className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            ยืนยันตัวตนผู้ดูแลระบบ (Admin)
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            เฉพาะทีมงาน VNT Event Organizer และคณะผู้จัดงาน โปรดระบุรหัสผ่านเพื่อเข้าถึงแผงควบคุม
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              maxLength={12}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ระบุรหัสผ่าน"
              className="w-full text-center tracking-widest text-lg font-mono font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 px-4 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-bold">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 shadow-xs transition-all cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
