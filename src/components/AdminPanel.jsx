import React, { useState } from 'react';
import StaffScanner from './StaffScanner';
import LuckyDraw from './LuckyDraw';
import { TEAM_COLORS, BUSES } from '../utils/mockData';
import {
  ShieldLockIcon,
  TrophyIcon,
  QrScanIcon,
  UsersIcon,
  DownloadIcon,
  CheckCircleIcon,
  SparklesIcon,
} from './ui/Icons';

export default function AdminPanel({
  participants,
  onResetData,
  onAddParticipant,
  onLockAdmin,
  onClaimFood,
  onAddScore,
  onAwardPrize,
}) {
  const [adminTab, setAdminTab] = useState('luckydraw');
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('all');
  const [busFilter, setBusFilter] = useState('all');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('red');
  const [newBus, setNewBus] = useState(BUSES[0]);

  // Custom non-blocking confirmation modal & toast state (Zero native alert/confirm)
  const [confirmModal, setConfirmModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage((prev) => (prev === text ? null : prev));
    }, 3500);
  };

  const filtered = participants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchColor = colorFilter === 'all' || p.teamColor === colorFilter;
    const matchBus = busFilter === 'all' || p.busNumber === busFilter;
    return matchSearch && matchColor && matchBus;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddParticipant({
      name: newName.trim(),
      teamColor: newColor,
      busNumber: newBus,
    });
    setNewName('');
    setShowAddForm(false);
    showToast(`เพิ่มรายชื่อ "${newName.trim()}" เข้าสู่ระบบเรียบร้อยแล้ว`);
  };

  const exportCSV = () => {
    const headers = [
      'ID',
      'ชื่อ-นามสกุล',
      'ทีมสี',
      'เลขรถ',
      'สถานะรับอาหาร',
      'เวลาที่รับ',
      'คะแนน',
      'ประกวดชุดเย็น',
      'รางวัล',
    ];
    const rows = participants.map((p) => [
      p.id,
      p.name,
      p.teamColor,
      `"${p.busNumber}"`,
      p.foodClaimed ? 'รับแล้ว' : 'ยังไม่ได้รับ',
      p.foodClaimedAt ? `"${new Date(p.foodClaimedAt).toLocaleString('th-TH')}"` : '-',
      p.score || 0,
      p.joinEveningContest === 'yes' ? 'เข้าร่วม' : 'ไม่เข้าร่วม',
      p.wonPrizeName ? `"${p.wonPrizeName}"` : '-',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tour_participants_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ส่งออกไฟล์ CSV สำหรับตรวจเช็คข้อมูลสำเร็จ');
  };

  const triggerConfirmReset = (mode, title, description) => {
    setConfirmModal({ mode, title, description });
  };

  const executeConfirmedReset = () => {
    if (!confirmModal) return;
    onResetData(confirmModal.mode);
    showToast(`ดำเนินการ "${confirmModal.title}" เรียบร้อยแล้ว`);
    setConfirmModal(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 relative">
      {/* Custom Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-lg border border-zinc-700 dark:border-zinc-300"
        >
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Custom Confirmation Dialog Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
              ยืนยันการดำเนินการ: {confirmModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={executeConfirmedReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                ยืนยันการรีเซ็ต
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Admin Header & Sub-Tab Switcher */}
      <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono">
                STAFF & ADMIN CONSOLE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>UNLOCKED</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              ศูนย์จัดการระบบสำหรับทีมงาน (Admin)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              ระบบจับรางวัล Lucky Draw บนเวที • สแกน QR รับอาหารเช้าและเพิ่มคะแนนสี • จัดการรายชื่อผู้ร่วมงาน{' '}
              <span className="font-mono tabular-nums font-bold">{participants.length}</span> ท่าน
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onLockAdmin && (
              <button
                type="button"
                onClick={onLockAdmin}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold border border-red-500/20 transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ShieldLockIcon unlocked={false} className="w-4 h-4" />
                <span>ล็อคโหมดผู้ดูแล</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setAdminTab('luckydraw')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                adminTab === 'luckydraw'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <TrophyIcon className="w-4 h-4 text-amber-500" />
              <span>จับรางวัล Lucky Draw</span>
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('scanner')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                adminTab === 'scanner'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <QrScanIcon className="w-4 h-4 text-emerald-500" />
              <span>สแกนเนอร์ QR สตาฟฟ์</span>
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('database')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                adminTab === 'database'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <UsersIcon className="w-4 h-4 text-sky-500" />
              <span>ฐานข้อมูลรายชื่อ ({participants.length})</span>
            </button>
          </div>

          <div className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <span>
              รับอาหารแล้ว: {participants.filter((p) => p.foodClaimed).length}/{participants.length}
            </span>
            <span>•</span>
            <span>
              รับรางวัลแล้ว: {participants.filter((p) => p.wonPrize).length}/{participants.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tab 1: Lucky Draw */}
      {adminTab === 'luckydraw' && (
        <div>
          <LuckyDraw participants={participants} onAwardPrize={onAwardPrize} />
        </div>
      )}

      {/* Tab 2: Staff Scanner Mode */}
      {adminTab === 'scanner' && (
        <div>
          <StaffScanner
            participants={participants}
            onClaimFood={onClaimFood}
            onAddScore={onAddScore}
          />
        </div>
      )}

      {/* Tab 3: Database Management Mode */}
      {adminTab === 'database' && (
        <div className="space-y-5">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                + เพิ่มรายชื่อผู้ร่วมงาน
              </button>
              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>ส่งออกไฟล์ CSV</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  triggerConfirmReset(
                    'food-only',
                    'รีเซ็ตสถานะอาหารเช้า',
                    'ระบบจะเปลี่ยนสถานะการรับอาหารของทุกคนกลับเป็น "ยังไม่ได้รับ" เพื่อเริ่มต้นการสแกนใหม่'
                  )
                }
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer"
              >
                รีเซ็ตสิทธิ์อาหาร
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerConfirmReset(
                    'prizes-only',
                    'รีเซ็ตประวัติผู้ได้รับรางวัล',
                    'ระบบจะล้างสถานะผู้โชคดีทั้งหมด เพื่อให้ทุกคนมีสิทธิ์ถูกสุ่มรางวัลใหม่'
                  )
                }
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition-colors cursor-pointer"
              >
                รีเซ็ตรางวัล
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerConfirmReset(
                    'all',
                    'รีเซ็ตข้อมูลทั้งหมดกลับค่าเริ่มต้น',
                    'ข้อมูลคะแนนสะสม สถานะรับอาหาร และรางวัลทั้งหมดจะถูกรีเซ็ตกลับสู่ค่าเริ่มต้นของระบบ'
                  )
                }
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
              >
                รีเซ็ตระบบทั้งหมด
              </button>
            </div>
          </div>

          {/* Add Participant Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreate}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                ลงทะเบียนผู้ร่วมงานเพิ่มเติม
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ระบุชื่อ-นามสกุล"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                    สังกัดทีมสี
                  </label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {TEAM_COLORS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">
                    หมายเลขรถบัส
                  </label>
                  <select
                    value={newBus}
                    onChange={(e) => setNewBus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {BUSES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  บันทึกรายชื่อ
                </button>
              </div>
            </form>
          )}

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ หรือรหัสประจำตัว (เช่น TOUR-001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">ทุกทีมสี (10 สี)</option>
              {TEAM_COLORS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">รถบัสทุกคัน</option>
              {BUSES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 uppercase text-[11px] font-bold tracking-wider">
                    <th className="py-3.5 px-4">รหัส</th>
                    <th className="py-3.5 px-4">ชื่อ-นามสกุล</th>
                    <th className="py-3.5 px-4">ทีมสี</th>
                    <th className="py-3.5 px-4">รถบัส</th>
                    <th className="py-3.5 px-4">อาหารเช้า</th>
                    <th className="py-3.5 px-4">คะแนน</th>
                    <th className="py-3.5 px-4">ประกวดชุด</th>
                    <th className="py-3.5 px-4">รางวัลที่ได้รับ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-zinc-500">
                        ไม่พบรายชื่อผู้ร่วมงานที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => {
                      const colorInfo =
                        TEAM_COLORS.find((t) => t.id === p.teamColor) || TEAM_COLORS[0];
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono tabular-nums font-bold text-zinc-900 dark:text-zinc-100">
                            {p.id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            {p.name}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                              style={{
                                backgroundColor: `${colorInfo.hex}18`,
                                color: colorInfo.hex,
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: colorInfo.hex }}
                              />
                              {colorInfo.name}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                            {p.busNumber}
                          </td>
                          <td className="py-3 px-4">
                            {p.foodClaimed ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                <span>รับแล้ว</span>
                              </span>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-500">รอรับสิทธิ์</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums font-bold text-zinc-900 dark:text-zinc-100">
                            {p.score || 0}
                          </td>
                          <td className="py-3 px-4">
                            {p.joinEveningContest === 'yes' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                <SparklesIcon className="w-3 h-3" />
                                <span>ลงประกวด</span>
                              </span>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {p.wonPrizeName ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                <TrophyIcon className="w-3 h-3" />
                                <span>{p.wonPrizeName}</span>
                              </span>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
