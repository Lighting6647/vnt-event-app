import React, { useState, useEffect } from 'react';
import StaffScanner from './StaffScanner';
import LuckyDraw from './LuckyDraw';
import { TEAM_COLORS, BUSES } from '../utils/mockData';
import { playSuccess, playWarning, playPAChime, speakAnnouncement } from '../utils/soundEffects';
import {
  ShieldLockIcon,
  TrophyIcon,
  QrScanIcon,
  UsersIcon,
  DownloadIcon,
  CheckCircleIcon,
  SparklesIcon,
  TrashIcon,
  SettingsIcon,
  KeyIcon,
  MegaphoneIcon,
  Volume2Icon,
  PassIcon,
} from './ui/Icons';

export default function AdminPanel({
  participants,
  onResetData,
  onAddParticipant,
  onDeleteParticipant,
  onLockAdmin,
  onClaimFood,
  onAddScore,
  onAwardPrize,
  onNavigateTab,
  currentSelectedId,
  onAdminSwitchUser,
  onAdminClearUser,
  onAdminOpenOnboardingModal,
}) {
  const [adminTab, setAdminTab] = useState('luckydraw');
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('all');
  const [busFilter, setBusFilter] = useState('all');

  // Attendee Identity & Switch Management State
  const [identitySearch, setIdentitySearch] = useState('');
  const [identityBusFilter, setIdentityBusFilter] = useState('all');
  const [identityActionMsg, setIdentityActionMsg] = useState('');

  const currentDevicePerson = currentSelectedId
    ? participants.find((p) => String(p.id) === String(currentSelectedId))
    : null;

  const filteredIdentityList = participants.filter((p) => {
    if (!p) return false;
    if (identityBusFilter !== 'all' && (!p.busNumber || !p.busNumber.includes(identityBusFilter))) {
      return false;
    }
    if (identitySearch.trim()) {
      const q = identitySearch.toLowerCase().trim();
      const matchName = p.name && p.name.toLowerCase().includes(q);
      const matchId = p.id && String(p.id).toLowerCase().includes(q);
      const matchTeam = p.teamColor && p.teamColor.toLowerCase().includes(q);
      const matchBus = p.busNumber && p.busNumber.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchTeam && !matchBus) return false;
    }
    return true;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('red');
  const [newBus, setNewBus] = useState(BUSES[0]);

  // Custom non-blocking confirmation modal & toast state (Zero native alert/confirm)
  const [confirmModal, setConfirmModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Broadcast & Public Address (PA) State
  const [broadcastTitle, setBroadcastTitle] = useState('📢 ประกาศด่วนจากทีมงาน VNT');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastUrgency, setBroadcastUrgency] = useState('info');
  const [broadcastTargetBus, setBroadcastTargetBus] = useState('all');
  const [broadcastSound, setBroadcastSound] = useState('chime');
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [broadcastAcks, setBroadcastAcks] = useState([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [ackFilterTab, setAckFilterTab] = useState('unacked'); // 'unacked' or 'acked'
  const [ackBusFilter, setAckBusFilter] = useState('all');

  // Departure Countdown State
  const [activeCountdown, setActiveCountdown] = useState(null);
  const [countdownTime, setCountdownTime] = useState('08:30');
  const [countdownTitle, setCountdownTitle] = useState('รถบัสออกเดินทางสู่ จ.นครนายก');
  const [countdownBus, setCountdownBus] = useState('all');

  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: 'init-1',
      title: '🚌 เตรียมตัวขึ้นรถบัสทุกคัน',
      message: 'ขอความกรุณาผู้ร่วมงานทุกท่าน เตรียมพร้อมขึ้นรถบัสประจำคัน ภายในเวลา 08:00 น.',
      urgency: 'info',
      targetBus: 'all',
      time: '07:45 น.',
    },
  ]);

  // Fetch broadcast, acks, and countdown on mount & periodic sync
  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/broadcast/current')
        .then((r) => r.json())
        .then((r) => {
          if (r.success) {
            setActiveBroadcast(r.broadcast);
            if (r.broadcast) {
              fetch(`/api/broadcast/acknowledgments?id=${r.broadcast.id}`)
                .then((res) => res.json())
                .then((ackData) => {
                  if (ackData.success) setBroadcastAcks(ackData.acks || []);
                })
                .catch(() => {});
            }
          }
        })
        .catch(() => {});

      fetch('/api/countdown/current')
        .then((r) => r.json())
        .then((r) => {
          if (r.success) setActiveCountdown(r.countdown);
        })
        .catch(() => {});
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCountdown = async () => {
    if (!countdownTime) {
      showToast('กรุณาระบุเวลารถออก');
      return;
    }
    try {
      const res = await fetch('/api/countdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetTime: countdownTime,
          title: countdownTitle,
          targetBus: countdownBus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveCountdown(data.countdown);
        showToast('🚀 เริ่มระบบนับถอยหลังขึ้นรถเรียบร้อยแล้ว!');
      }
    } catch {
      showToast('ส่งคำสั่งไม่สำเร็จ');
    }
  };

  const handleClearCountdown = async () => {
    try {
      const res = await fetch('/api/countdown/clear', { method: 'POST' });
      if (res.ok) {
        setActiveCountdown(null);
        showToast('ยกเลิกเวลานับถอยหลังขึ้นรถแล้ว');
      }
    } catch {
      setActiveCountdown(null);
      showToast('ยกเลิกแล้ว');
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      showToast('กรุณาระบุข้อความประกาศก่อนส่ง');
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          urgency: broadcastUrgency,
          targetBus: broadcastTargetBus,
          soundType: broadcastSound,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveBroadcast(data.broadcast);
        setBroadcastHistory((prev) => [
          {
            ...data.broadcast,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
        showToast('🔊 ส่งสัญญาณเสียงตามสายไปยังทุกอุปกรณ์แล้ว!');
      } else {
        showToast(data.message || 'ส่งประกาศไม่สำเร็จ');
      }
    } catch {
      showToast('เชื่อมต่อเซิร์ฟเวอร์ขัดข้อง');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleClearBroadcast = async () => {
    try {
      const res = await fetch('/api/broadcast/clear', { method: 'POST' });
      if (res.ok) {
        setActiveBroadcast(null);
        showToast('ยกเลิกประกาศเสียงตามสายเรียบร้อยแล้ว');
      }
    } catch {
      setActiveBroadcast(null);
      showToast('ยกเลิกประกาศแล้ว');
    }
  };

  const handleApplyPreset = (title, msg, urgency = 'info', target = 'all', sound = 'chime') => {
    setBroadcastTitle(title);
    setBroadcastMessage(msg);
    setBroadcastUrgency(urgency);
    setBroadcastTargetBus(target);
    setBroadcastSound(sound);
    showToast('โหลดข้อความด่วนเรียบร้อย พร้อมกดส่ง');
  };

  const handleTestSound = () => {
    if (broadcastSound === 'warning') {
      playWarning();
    } else {
      playPAChime();
    }
    if (broadcastSound === 'speech' || broadcastUrgency === 'urgent') {
      speakAnnouncement(`${broadcastTitle}. ${broadcastMessage || 'ทดสอบระบบเสียงตามสาย'}`);
    }
    showToast('กำลังทดสอบเสียงสัญญาณบนเครื่องนี้');
  };

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage((prev) => (prev === text ? null : prev));
    }, 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    if (onDeleteParticipant) {
      const res = await onDeleteParticipant(target.id);
      showToast(res?.message || `ลบรายชื่อ ${target?.name || ''} เรียบร้อย`);
    }
  };

  const filtered = participants.filter((p) => {
    if (!p) return false;
    const pName = p.name || '';
    const pId = p.id || '';
    const matchSearch =
      pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pId.toLowerCase().includes(searchTerm.toLowerCase());
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
    const rows = participants.filter(Boolean).map((p) => [
      p.id || '',
      `"${p.name || ''}"`,
      p.teamColor || '',
      `"${p.busNumber || ''}"`,
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

  const exportUnclaimedFoodCSV = () => {
    const unclaimed = participants.filter((p) => !p.foodClaimed);
    if (unclaimed.length === 0) {
      showToast('ทุกคนรับอาหารเช้าครบ 100% แล้ว! ไม่พบรายชื่อตกค้าง');
      return;
    }

    // Sort by bus number for easy head-count coordination
    const sorted = [...unclaimed].sort((a, b) => (a.busNumber || '').localeCompare(b.busNumber || ''));

    const headers = [
      'คันรถบัส',
      'รหัสผู้ร่วมงาน',
      'ชื่อ-นามสกุล',
      'ทีมสี',
      'สถานะอาหารเช้า',
    ];

    const rows = sorted.filter(Boolean).map((p) => [
      `"${p.busNumber || ''}"`,
      p.id || '',
      `"${p.name || ''}"`,
      p.teamColor || '',
      'ยังไม่ได้รับอาหาร',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `unclaimed_food_by_bus_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`ส่งออกรายชื่อผู้ยังไม่ได้รับอาหาร (${unclaimed.length} ท่าน) แยกตามคันรถสำเร็จ`);
  };

  const exportActivitySummaryCSV = () => {
    // 1. Team Scores Breakdown
    const teamScores = TEAM_COLORS.map((team) => {
      const members = participants.filter((p) => p.teamColor === team.id);
      const totalScore = members.reduce((sum, p) => sum + (p.score || 0), 0);
      const winnersCount = members.filter((p) => p.wonPrize).length;
      return {
        teamName: team.name,
        colorId: team.id,
        memberCount: members.length,
        totalScore,
        winnersCount,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);

    // 2. Lucky Draw Winners
    const winners = participants.filter((p) => p.wonPrize);

    let csvContent = '\uFEFF';
    csvContent += '=== สรุปคะแนนสะสม 10 ทีมสี (KoniX Meet the Jungle) ===\n';
    csvContent += 'อันดับ,ชื่อทีมสี,จำนวนสมาชิก (คน),คะแนนสะสมรวม,ผู้ได้รับรางวัล Lucky Draw (คน)\n';
    teamScores.forEach((t, idx) => {
      csvContent += `${idx + 1},"${t.teamName}",${t.memberCount},${t.totalScore},${t.winnersCount}\n`;
    });

    csvContent += '\n=== รายชื่อผู้โชคดีได้รับรางวัล Lucky Draw บนเวที ===\n';
    csvContent += 'ลำดับ,รหัสผู้ร่วมงาน,ชื่อ-นามสกุล,คันรถบัส,ทีมสี,ชื่อรางวัลที่ได้รับ,เวลาที่ได้รับรางวัล\n';
    if (winners.length === 0) {
      csvContent += '-,ยังไม่มีผู้ได้รับรางวัล,-,-,-,-\n';
    } else {
      winners.forEach((w, idx) => {
        const timeStr = w.wonPrizeAt ? new Date(w.wonPrizeAt).toLocaleString('th-TH') : '-';
        csvContent += `${idx + 1},${w.id || ''},"${w.name || ''}","${w.busNumber || ''}",${w.teamColor || ''},"${w.wonPrizeName || ''}","${timeStr}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `konix_activity_lucky_draw_summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ส่งออกรายงานสรุปคะแนน 10 ทีมสีและผู้โชคดีสำเร็จ');
  };

  // Settings Tab State: Custom Admin Passcode
  const [customPasscode, setCustomPasscode] = useState(() => {
    try {
      return localStorage.getItem('vnt_admin_custom_passcode') || '';
    } catch {
      return '';
    }
  });
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeMsg, setPasscodeMsg] = useState({ type: '', text: '' });

  const handleSaveCustomPasscode = (e) => {
    e.preventDefault();
    const trimmed = newPasscode.trim();
    if (!trimmed || trimmed.length < 4) {
      playWarning();
      setPasscodeMsg({ type: 'error', text: 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร' });
      return;
    }
    if (trimmed !== confirmPasscode.trim()) {
      playWarning();
      setPasscodeMsg({ type: 'error', text: 'รหัสผ่านทั้งสองช่องไม่ตรงกัน' });
      return;
    }
    try {
      localStorage.setItem('vnt_admin_custom_passcode', trimmed);
      setCustomPasscode(trimmed);
      setNewPasscode('');
      setConfirmPasscode('');
      playSuccess();
      setPasscodeMsg({ type: 'success', text: 'บันทึกรหัสผ่านใหม่สำหรับทีมงานเรียบร้อยแล้ว!' });
      showToast('อัปเดตรหัสผ่าน Admin ใหม่เรียบร้อย');
    } catch (err) {
      setPasscodeMsg({ type: 'error', text: 'ไม่สามารถบันทึกได้ โปรดตรวจสอบการอนุญาตจัดเก็บข้อมูล' });
    }
  };

  const handleResetPasscodeToDefault = () => {
    try {
      localStorage.removeItem('vnt_admin_custom_passcode');
      setCustomPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
      playSuccess();
      setPasscodeMsg({ type: 'success', text: 'รีเซ็ตรหัสผ่านกลับสู่ค่ามาตรฐาน (2026 / 1234) เรียบร้อย' });
      showToast('รีเซ็ตรหัสผ่านกลับสู่ค่ามาตรฐานแล้ว');
    } catch {}
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

      {/* Delete Confirmation Dialog Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white dark:bg-zinc-900 border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <TrashIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                  ยืนยันการลบรายชื่อผู้ร่วมงาน
                </h3>
                <p className="text-xs text-zinc-500">
                  {deleteTarget.id} • {deleteTarget.name}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบรายชื่อ <strong>"{deleteTarget.name}"</strong> ออกจากระบบ? ข้อมูลคะแนนและสิทธิ์การรับอาหารจะถูกลบออกถาวร
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                ยืนยันการลบ
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
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('pass')}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs sm:text-sm font-bold border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
              >
                <span>↩ กลับหน้าผู้ร่วมงาน</span>
              </button>
            )}
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
              onClick={() => setAdminTab('broadcast')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                adminTab === 'broadcast'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <MegaphoneIcon className="w-4 h-4 text-amber-500" />
              <span>เสียงตามสาย & บรอดแคสต์</span>
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
            <button
              type="button"
              onClick={() => setAdminTab('identity')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                adminTab === 'identity'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <PassIcon className="w-4 h-4 text-emerald-500" />
              <span>สลับ/รีเซ็ตชื่อผู้ร่วมงาน</span>
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                adminTab === 'settings'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-violet-500" />
              <span>ตั้งค่าระบบ & รหัสผ่าน</span>
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
            onNavigateTab={onNavigateTab}
          />
        </div>
      )}

      {/* Tab: Live Public Address (PA) & Broadcast Center */}
      {adminTab === 'broadcast' && (
        <div className="space-y-6">
          {/* Active Live Status Banner */}
          {activeBroadcast ? (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border-2 border-emerald-500/80 p-5 sm:p-7 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>กำลังถ่ายทอดสดบนหน้าจอผู้ร่วมงาน (LIVE)</span>
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      ส่งเมื่อ: {activeBroadcast.formattedTime || 'เพิ่งส่ง'} น.
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                      เป้าหมาย: {activeBroadcast.targetBus === 'all' || !activeBroadcast.targetBus ? 'ทุกคน' : activeBroadcast.targetBus}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeBroadcast.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl bg-black/40 p-3 rounded-xl border border-zinc-800 whitespace-pre-line">
                    {activeBroadcast.message}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeBroadcast.soundType === 'warning') playWarning();
                      else playPAChime();
                      speakAnnouncement(`${activeBroadcast.title}. ${activeBroadcast.message}`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
                  >
                    <Volume2Icon className="w-4 h-4 text-emerald-400" />
                    <span>ฟังเสียงจำลอง</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearBroadcast}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 cursor-pointer"
                  >
                    <span>🛑 ยกเลิกประกาศสดทันที</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>สถานะระบบเสียงตามสาย: <strong>สแตนด์บาย</strong> (พร้อมส่งสัญญาณและแจ้งเตือนด่วน)</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-400">Real-time SSE Engine Active</span>
            </div>
          )}

          {/* Live Read Receipts & Acknowledgment Tracking Card */}
          {activeBroadcast && (
            <div className="bg-white dark:bg-zinc-900/90 p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    <span>สถิติการรับทราบประกาศเสียงตามสาย (Read Receipts)</span>
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    อัปเดตสดแบบเรียลไทม์เมื่อผู้ร่วมงานกด "รับทราบแล้ว (ปิด)" บนมือถือ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    รับทราบแล้ว {broadcastAcks.length} / {participants.length} คน ({Math.round((broadcastAcks.length / (participants.length || 1)) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (broadcastAcks.length / (participants.length || 1)) * 100)}%` }}
                />
              </div>

              {/* Bus Breakdown Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs font-mono">
                {BUSES.map((bus) => {
                  const busMembers = participants.filter((p) => p.busNumber === bus);
                  const busAcks = broadcastAcks.filter((a) => a.busNumber === bus);
                  const pct = Math.round((busAcks.length / (busMembers.length || 1)) * 100);
                  return (
                    <div key={bus} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold block truncate text-zinc-700 dark:text-zinc-300">
                        {bus.replace(' (ทะเบียน 30-', ' (')}
                      </span>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{busAcks.length}/{busMembers.length}</span>
                        <span className="text-zinc-400">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabs for unacknowledged vs acknowledged */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAckFilterTab('unacked')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      ackFilterTab === 'unacked'
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    ยังไม่รับทราบ ({participants.length - broadcastAcks.length} ท่าน)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAckFilterTab('acked')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      ackFilterTab === 'acked'
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    รับทราบแล้ว ({broadcastAcks.length} ท่าน)
                  </button>
                </div>

                <select
                  value={ackBusFilter}
                  onChange={(e) => setAckBusFilter(e.target.value)}
                  className="text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-700 dark:text-zinc-300"
                >
                  <option value="all">ทุกคันรถ</option>
                  {BUSES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Member List Preview */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {(() => {
                  const ackUserIds = new Set(broadcastAcks.map((a) => a.userId.toUpperCase()));
                  const list = participants.filter((p) => {
                    if (!p) return false;
                    if (ackBusFilter !== 'all' && p.busNumber !== ackBusFilter) return false;
                    const isAcked = ackUserIds.has(p.id.toUpperCase());
                    return ackFilterTab === 'acked' ? isAcked : !isAcked;
                  });

                  if (list.length === 0) {
                    return (
                      <div className="py-4 text-center text-xs text-zinc-400">
                        {ackFilterTab === 'unacked' ? '✓ ผู้ร่วมงานทุกคนกดรับทราบเรียบร้อยแล้ว!' : 'ยังไม่มีผู้กดรับทราบ'}
                      </div>
                    );
                  }

                  return list.slice(0, 30).map((p) => (
                    <div
                      key={p.id}
                      className="px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ackUserIds.has(p.id.toUpperCase()) ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{p.name}</span>
                        <span className="font-mono text-[10px] text-zinc-400">{p.id}</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{p.busNumber?.split(' ')[0]}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Departure Countdown Controller Card */}
          <div className="bg-white dark:bg-zinc-900/90 p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <span>⏱️ ระบบนับถอยหลังขึ้นรถบัส (Live Departure Countdown)</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ระบุเวลาออกเดินทางเพื่อให้หน้าจอมือถือของผู้ร่วมงานทุกคนแสดงแถบนับถอยหลังพร้อมแจ้งเตือนด่วน 5 นาที
                </p>
              </div>

              {activeCountdown && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>กำลังนับถอยหลัง: {activeCountdown.targetTime} น.</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  เวลารถออก (HH:MM):
                </label>
                <input
                  type="time"
                  value={countdownTime}
                  onChange={(e) => setCountdownTime(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ข้อความกำกับ:
                </label>
                <input
                  type="text"
                  value={countdownTitle}
                  onChange={(e) => setCountdownTitle(e.target.value)}
                  placeholder="เช่น รถบัสออกเดินทางสู่ จ.นครนายก"
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  กลุ่มเป้าหมาย (คันรถ):
                </label>
                <select
                  value={countdownBus}
                  onChange={(e) => setCountdownBus(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="all">🌐 ผู้ร่วมงานทุกคน (ทุกคัน)</option>
                  {BUSES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Time Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-zinc-400 font-semibold">เวลาด่วน:</span>
                {['07:30', '08:00', '08:30', '12:00', '13:00'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCountdownTime(t)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono font-bold cursor-pointer transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {activeCountdown && (
                  <button
                    type="button"
                    onClick={handleClearCountdown}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-red-600 dark:text-red-400 text-xs font-bold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                  >
                    ยกเลิกเวลานับถอยหลัง
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartCountdown}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 cursor-pointer active:scale-95"
                >
                  🚀 เริ่มนับถอยหลังบนหน้าจอผู้ร่วมงาน
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click Quick Preset Broadcasts */}
          <div className="bg-white dark:bg-zinc-900/90 p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                <span>ข้อความบรอดแคสต์ด่วนสำเร็จรูป (1-Click Presets)</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                คลิกเลือกเทมเพลตเพื่อโหลดข้อความและพร้อมกดส่งกระจายเสียงได้ทันที
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset(
                    '🚌 เรียกรวมพลขึ้นรถบัสทุกคัน',
                    'ขอความกรุณาผู้ร่วมงานทุกท่าน เตรียมสัมภาระและพร้อมขึ้นรถบัสประจำคัน ภายในเวลา 10 นาที ขอบคุณค่ะ',
                    'info',
                    'all',
                    'chime'
                  )
                }
                className="text-left p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                    🚌 รวมพลขึ้นรถบัส (10 นาที)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    ทุกคน
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  เตรียมสัมภาระและพร้อมขึ้นรถบัสประจำคัน ภายใน 10 นาที
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset(
                    '🥪 อาหารเช้าพร้อมให้บริการแล้ว',
                    'อาหารเช้าและเครื่องดื่มพร้อมให้บริการแล้ว ณ จุดเช็คอิน กรุณานำ QR Code ในบัตรดิจิทัลมาสแกนรับได้เลยค่ะ',
                    'info',
                    'all',
                    'chime'
                  )
                }
                className="text-left p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                    🥪 อาหารเช้าพร้อมเสิร์ฟ
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    ทุกคน
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  อาหารเช้าและเครื่องดื่มพร้อมบริการ ณ จุดเช็คอิน นำ QR มาสแกนรับได้เลย
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset(
                    '🎯 รวมพลกิจกรรม Team Building 10 สี',
                    'ขอเชิญสมาชิกทั้ง 10 สี พร้อมกันที่สนามกิจกรรม/ห้องจัดเลี้ยง เพื่อเริ่มการแข่งขันสันทนาการเก็บคะแนนประจำปี!',
                    'urgent',
                    'all',
                    'speech'
                  )
                }
                className="text-left p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-500 transition-colors">
                    🎯 รวมพลกิจกรรม Team Building
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    ด่วนสำคัญ
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  ขอเชิญสมาชิกทั้ง 10 สี พร้อมกันที่สนามกิจกรรม เพื่อเริ่มแข่งขันเก็บแต้ม
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset(
                    '📸 ถ่ายภาพหมู่ร่วมกัน ณ เวทีใหญ่',
                    'ขอเชิญคณะผู้บริหารและพนักงาน KoniX ทุกท่าน พร้อมกันที่บริเวณหน้าแบคดรอปเพื่อถ่ายภาพที่ระลึกร่วมกันค่ะ',
                    'info',
                    'all',
                    'chime'
                  )
                }
                className="text-left p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-500 transition-colors">
                    📸 ถ่ายภาพหมู่ที่ระลึก
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    ทุกคน
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  ขอเชิญผู้บริหารและพนักงานทุกคน พร้อมกันที่หน้าแบคดรอป
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset(
                    '⚠️ แจ้งเตือน: กำหนดเวลาคืนกุญแจห้องพัก',
                    'โปรดตรวจสอบสัมภาระและนำกุญแจห้องพักมาคืน ณ เคาน์เตอร์ล็อบบี้ ก่อนเวลา 12:00 น. เพื่อเตรียมเดินทางกลับ',
                    'urgent',
                    'all',
                    'warning'
                  )
                }
                className="text-left p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-red-500/50 hover:bg-red-500/5 transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-500 transition-colors">
                    ⚠️ คืนกุญแจห้องพัก (Check-out)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400">
                    สำคัญมาก
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  นำกุญแจห้องพักมาคืน ณ เคาน์เตอร์ล็อบบี้ ก่อนเวลา 12:00 น.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset(
                    '✨ เตรียมพร้อมสำหรับงานกาล่าไนท์ 18:30 น.',
                    'ขอเชิญทุกท่านแต่งกายในชุดประกวดแฟนซี และมาร่วมสนุกในงานเลี้ยงกาล่าดินเนอร์ ณ ห้องจัดเลี้ยงใหญ่ค่ะ',
                    'countdown',
                    'all',
                    'chime'
                  )
                }
                className="text-left p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                    ✨ งานกาล่าไนท์ & ดินเนอร์
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    18:30 น.
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  แต่งกายในชุดประกวดแฟนซี และร่วมสนุกในงานกาล่าดินเนอร์
                </p>
              </button>
            </div>
          </div>

          {/* Custom Broadcast Dispatcher Console */}
          <div className="bg-white dark:bg-zinc-900/90 p-5 sm:p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <MegaphoneIcon className="w-5 h-5 text-emerald-500" />
                <span>แผงควบคุมระบบเสียงตามสาย (Custom Dispatcher)</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                พิมพ์ข้อความที่ต้องการประกาศและเลือกระดับความด่วนเพื่อส่งตรงเข้าหน้าจอมือถือผู้ร่วมงานทุกคน
              </p>
            </div>

            <div className="space-y-4">
              {/* Title & Target Bus Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    หัวข้อประกาศ:
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="เช่น 📢 ประกาศด่วนจากทีมงาน VNT"
                    className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    กลุ่มเป้าหมาย (คันรถ):
                  </label>
                  <select
                    value={broadcastTargetBus}
                    onChange={(e) => setBroadcastTargetBus(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">🌐 ผู้ร่วมงานทุกคน (ทุกคัน)</option>
                    {BUSES.map((b) => (
                      <option key={b} value={b}>
                        🚌 {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  เนื้อหาประกาศตามสาย:
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="พิมพ์ข้อความที่ต้องการให้ผู้ร่วมงานทุกคนอ่านหรือฟังเสียงตามสาย..."
                  className="w-full text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
                />
              </div>

              {/* Urgency & Sound Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Urgency Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    ระดับความเร่งด่วน:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBroadcastUrgency('info')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        broadcastUrgency === 'info'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      🟢 ทั่วไป
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastUrgency('urgent')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        broadcastUrgency === 'urgent'
                          ? 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-300 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      🔴 สำคัญด่วน
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastUrgency('countdown')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        broadcastUrgency === 'countdown'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      ⏱️ นับเวลา
                    </button>
                  </div>
                </div>

                {/* Sound Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    รูปแบบเสียงสัญญาณจำลอง:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBroadcastSound('chime')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        broadcastSound === 'chime'
                          ? 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-sky-300 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      🔔 กริ่งตามสาย
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastSound('warning')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        broadcastSound === 'warning'
                          ? 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-300 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      🚨 สัญญาณเตือน
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastSound('speech')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        broadcastSound === 'speech'
                          ? 'bg-violet-500/15 border-violet-500 text-violet-700 dark:text-violet-300 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      🗣️ AI อ่านไทย
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  <Volume2Icon className="w-4 h-4 text-emerald-500" />
                  <span>ทดสอบฟังเสียงบนเครื่องนี้</span>
                </button>

                <button
                  type="button"
                  disabled={isBroadcasting}
                  onClick={handleSendBroadcast}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95"
                >
                  <MegaphoneIcon className="w-4 h-4 animate-bounce" />
                  <span>{isBroadcasting ? 'กำลังส่งสัญญาณ...' : '📢 ส่งเสียงตามสายทันที (Broadcast Now)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* History of Sent Broadcasts */}
          <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <span>ประวัติการกระจายเสียงในรอบนี้ ({broadcastHistory.length})</span>
            </h4>
            <div className="space-y-2">
              {broadcastHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {item.targetBus === 'all' || !item.targetBus ? 'ทุกคน' : item.targetBus}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{item.message}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
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
                <span>ส่งออก CSV ทั้งหมด</span>
              </button>
              <button
                type="button"
                onClick={exportUnclaimedFoodCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer"
                title="ส่งออกรายชื่อผู้ยังไม่ได้รับอาหาร เรียงตามคันรถบัสให้หัวหน้าบัสตามตัว"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>📋 ผู้ยังไม่รับอาหาร (แยกตามบัส)</span>
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
                    <th className="py-3.5 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-zinc-500">
                        ไม่พบรายชื่อผู้ร่วมงานที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => {
                      if (!p) return null;
                      const colorInfo =
                        TEAM_COLORS.find((t) => t.id === p.teamColor) || TEAM_COLORS[0] || { name: 'ทีมสี', hex: '#10b981' };
                      return (
                        <tr
                          key={p.id || Math.random()}
                          className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono tabular-nums font-bold text-zinc-900 dark:text-zinc-100">
                            {p.id || '-'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            {p.name || 'ไม่ระบุชื่อ'}
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
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(p)}
                              title={`ลบรายชื่อ ${p.name}`}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
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

      {/* Tab: Attendee Identity & Device Switch (Admin Exclusive) */}
      {adminTab === 'identity' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ADMIN EXCLUSIVE ONLY
                  </span>
                  <span className="text-xs font-mono text-zinc-400">ควบคุมสิทธิ์ตัวตน 182 ท่าน</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  ศูนย์จัดการสลับ & รีเซ็ตตัวตนผู้ร่วมงาน
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
                  สำหรับแอดมินเท่านั้น: ใช้กรณีพนักงานเลือกชื่อตนเองผิด หรือต้องการผูกเครื่องใหม่ โดยผู้ร่วมงานทั่วไปไม่สามารถแก้ไขเองได้
                </p>
              </div>

              {/* Current Device Binding Status Card */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-2 min-w-[280px]">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  ตัวตนของอุปกรณ์เครื่องนี้ (Current Device):
                </span>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          (currentDevicePerson &&
                            TEAM_COLORS.find((t) => t.id === currentDevicePerson.teamColor)?.hex) ||
                          '#71717a',
                      }}
                    />
                    <strong className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate">
                      {currentDevicePerson ? currentDevicePerson.name : 'ยังไม่ระบุตัวตน'}
                    </strong>
                    <span className="text-xs font-mono text-zinc-400">
                      ({currentDevicePerson ? currentDevicePerson.id : '---'})
                    </span>
                  </div>

                  {currentDevicePerson && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`ต้องการล้างตัวตนของเครื่องนี้ (${currentDevicePerson.name}) ออกใช่หรือไม่?`)) {
                          onAdminClearUser && onAdminClearUser();
                          setIdentityActionMsg('ล้างตัวตนของอุปกรณ์เครื่องนี้เรียบร้อยแล้ว');
                          setTimeout(() => setIdentityActionMsg(''), 4000);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer shrink-0"
                    >
                      ล้างตัวตน
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-zinc-200/50 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      onAdminOpenOnboardingModal && onAdminOpenOnboardingModal();
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    🔍 เปิดหน้าต่างเลือกชื่อบนเครื่องนี้ (Onboarding Picker)
                  </button>
                </div>
              </div>
            </div>

            {/* Notification message */}
            {identityActionMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
                <span>✓</span>
                <span>{identityActionMsg}</span>
              </div>
            )}

            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {['all', 'รถบัสคันที่ 1', 'รถบัสคันที่ 2', 'รถบัสคันที่ 3', 'รถบัสคันที่ 4', 'รถบัสคันที่ 5'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setIdentityBusFilter(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      identityBusFilter === b
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {b === 'all' ? 'ทุกลำดับรถ' : b.replace('รถบัสคันที่ ', 'บัส ')}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, รหัส, สีทีม..."
                  value={identitySearch}
                  onChange={(e) => setIdentitySearch(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Attendee List Table / Grid with Switch Actions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">
                พบรายชื่อผู้ร่วมงาน ({filteredIdentityList.length} ท่าน)
              </span>
              <span className="text-xs text-zinc-400">
                กดสลับเครื่อง หรือคัดลอกลิงก์ส่งให้พนักงาน
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
              {filteredIdentityList.map((p) => {
                const team = TEAM_COLORS.find((t) => t.id === p.teamColor) || TEAM_COLORS[0];
                const isCurrent = currentSelectedId && String(currentSelectedId) === String(p.id);

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isCurrent
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-xs"
                        style={{ backgroundColor: team.hex }}
                      >
                        {p.id}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100 truncate">
                            {p.name}
                          </strong>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              เครื่องนี้ผูกอยู่
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-0.5">
                          <span style={{ color: team.hex }} className="font-bold">
                            ● {team.name}
                          </span>
                          <span>•</span>
                          <span>{p.busNumber?.split(' ')[0] || p.busNumber}</span>
                          <span>•</span>
                          <span className={p.foodClaimed ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                            {p.foodClaimed ? '✓ รับอาหารแล้ว' : '⏳ รอรับอาหาร'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const directUrl = `${window.location.origin}/?user=${encodeURIComponent(p.id)}&tab=pass`;
                          navigator.clipboard.writeText(directUrl);
                          setIdentityActionMsg(`คัดลอกลิงก์ส่วนตัวของ ${p.name} ลงคลิปบอร์ดแล้ว: ส่งทาง LINE ได้ทันที!`);
                          setTimeout(() => setIdentityActionMsg(''), 5000);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="คัดลอกลิงก์ส่วนตัวส่งให้พนักงาน"
                      >
                        <span>🔗</span>
                        <span>คัดลอกลิงก์ส่งพนักงาน</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onAdminSwitchUser && onAdminSwitchUser(p.id);
                          setIdentityActionMsg(`สลับอุปกรณ์เครื่องนี้เป็น "${p.name}" (รหัส ${p.id}) เรียบร้อยแล้ว`);
                          setTimeout(() => setIdentityActionMsg(''), 4000);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 active:scale-95'
                        }`}
                      >
                        <span>{isCurrent ? '✓ ผูกเครื่องนี้แล้ว' : 'สลับเครื่องนี้เป็นคนนี้'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Settings & Passcode Manager */}
      {adminTab === 'settings' && (
        <div className="space-y-6">
          {/* Card 1: Custom Admin Passcode Manager */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <KeyIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    จัดการรหัสผ่านแอดมิน (Admin Passcode)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    ตั้งรหัสผ่านสำหรับทีมงานเพื่อเข้าสู่หน้าควบคุมนี้ ปลอดภัยและไม่แสดงให้ผู้ร่วมงานทั่วไปเห็น
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {customPasscode ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ใช้รหัสผ่านกำหนดเอง (Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    ใช้รหัสมาตรฐาน (2026 / 1234)
                  </span>
                )}
              </div>
            </div>

            {/* Notification alert message if any */}
            {passcodeMsg.text && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
                  passcodeMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
                }`}
              >
                <span>{passcodeMsg.text}</span>
                <button
                  type="button"
                  onClick={() => setPasscodeMsg({ type: '', text: '' })}
                  className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveCustomPasscode} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  รหัสผ่านใหม่ที่ต้องการตั้ง:
                </label>
                <input
                  type="password"
                  maxLength={12}
                  placeholder="ระบุรหัสผ่านใหม่ (4-12 หลัก)"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ยืนยันรหัสผ่านใหม่อีกครั้ง:
                </label>
                <input
                  type="password"
                  maxLength={12}
                  placeholder="พิมพ์รหัสผ่านเดิมซ้ำอีกครั้ง"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  บันทึกรหัสผ่านใหม่
                </button>

                {customPasscode && (
                  <button
                    type="button"
                    onClick={handleResetPasscodeToDefault}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer border border-zinc-200 dark:border-zinc-700"
                  >
                    รีเซ็ตกลับเป็นรหัสมาตรฐานเริ่มต้น
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Card 2: Reporting & Excel Export Hub */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center">
                <DownloadIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  ศูนย์ส่งออกรายงาน (Reporting & Data Export Hub)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ดาวน์โหลดข้อมูลเพื่อเปิดใน Microsoft Excel หรือ Google Sheets รองรับภาษาไทย 100%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <UsersIcon className="w-4 h-4 text-sky-500" />
                    <span>ข้อมูลผู้ร่วมงานทั้งหมด ({participants.length} ท่าน)</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    รหัส, ชื่อ-นามสกุล, บัส, ทีมสี, สถานะอาหาร, คะแนนสะสม, รางวัลที่ได้รับ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <DownloadIcon className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์ .CSV</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <TrophyIcon className="w-4 h-4 text-amber-500" />
                    <span>สรุปคะแนน 10 ทีม & Lucky Draw</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    ตารางจัดอันดับคะแนนสะสม 10 ทีมสี และรายชื่อผู้ชนะรางวัลบนเวทีทั้งหมด
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportActivitySummaryCSV}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <DownloadIcon className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดรายงานคะแนน</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <QrScanIcon className="w-4 h-4 text-emerald-500" />
                    <span>ผู้ยังไม่รับอาหาร (แยกตามบัส)</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    รายชื่อผู้ยังไม่ได้รับอาหารเช้า จัดกลุ่มตามคันรถบัสสำหรับสตาฟฟ์ตามตัว
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportUnclaimedFoodCSV}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <DownloadIcon className="w-3.5 h-3.5" />
                  <span>ส่งออกรายชื่อตกค้าง</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Security & Architecture Audit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
              <span>VNT Core Engine v2.4 (Security Hardened)</span>
            </div>
            <div>
              <span>โหมดปลอดภัย: รหัสผ่านและแผงควบคุมถูกซ่อน 100% จากมุมมองผู้ร่วมงาน</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
