import React, { useState, useEffect, Suspense, lazy } from 'react';
import AppleNavbar from './components/AppleNavbar';
import DigitalPass from './components/DigitalPass';
import ActivityModal from './components/ActivityModal';
import AdminPasscodeModal from './components/AdminPasscodeModal';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ShieldLockIcon } from './components/ui/Icons';
import { SEED_PARTICIPANTS } from './utils/mockData';

const TripSchedule = lazy(() => import('./components/TripSchedule'));
const BusActivities = lazy(() => import('./components/BusActivities'));
const SpotTheDifference = lazy(() => import('./components/SpotTheDifference'));
const StaffScanner = lazy(() => import('./components/StaffScanner'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

function TabLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      <div className="h-28 rounded-3xl bg-zinc-200/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-48 rounded-3xl bg-zinc-200/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800" />
        <div className="h-48 rounded-3xl bg-zinc-200/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800" />
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pass');
  const [isDark, setIsDark] = useState(true);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [participants, setParticipants] = useState(() => {
    const local = localStorage.getItem('tour_participants_data');
    return local ? JSON.parse(local) : SEED_PARTICIPANTS;
  });
  const [selectedId, setSelectedId] = useState('TOUR-001');
  const [activityModalUser, setActivityModalUser] = useState(null);

  // Sync to backend if running
  useEffect(() => {
    fetch('/api/participants')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setParticipants(res.data);
          localStorage.setItem('tour_participants_data', JSON.stringify(res.data));
        }
      })
      .catch(() => {});
  }, []);

  const saveState = (updatedList) => {
    setParticipants(updatedList);
    localStorage.setItem('tour_participants_data', JSON.stringify(updatedList));
  };

  // Claim food
  const handleClaimFood = async (id) => {
    try {
      const res = await fetch('/api/claim-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = participants.map((p) => (p.id === id ? data.participant : p));
        saveState(updated);
        return { success: true, message: data.message, participant: data.participant };
      } else {
        return {
          success: false,
          alreadyClaimed: data.alreadyClaimed,
          message: data.message || 'ไม่สามารถรับอาหารได้',
          participant: data.participant,
        };
      }
    } catch {
      const found = participants.find((p) => p.id.toUpperCase() === id.toUpperCase());
      if (!found) return { success: false, message: 'ไม่พบรหัสผู้ร่วมงานในระบบ' };
      if (found.foodClaimed) {
        const time = new Date(found.foodClaimedAt).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return {
          success: false,
          alreadyClaimed: true,
          message: `ผู้ร่วมงานท่านนี้ได้รับอาหารไปแล้วเมื่อเวลา ${time} น. (ป้องกันการรับซ้ำ)`,
          participant: found,
        };
      }

      const updatedUser = {
        ...found,
        foodClaimed: true,
        foodClaimedAt: new Date().toISOString(),
      };
      const updated = participants.map((p) => (p.id === found.id ? updatedUser : p));
      saveState(updated);
      return {
        success: true,
        message: `รับอาหารสำเร็จเรียบร้อย (${found.name} - ${found.busNumber})`,
        participant: updatedUser,
      };
    }
  };

  // Add score
  const handleAddScore = async (id, points) => {
    try {
      const res = await fetch('/api/add-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, points }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.updatedParticipants) {
          saveState(data.updatedParticipants);
        } else if (data.participant) {
          const updated = participants.map((p) => (p.id === id ? data.participant : p));
          saveState(updated);
        }
        return { success: true, message: data.message, participant: data.participant };
      }
      return { success: false, message: data.message };
    } catch {
      const teamMatches = participants.filter(
        (p) => p.teamColor && p.teamColor.toLowerCase() === id.toLowerCase()
      );
      if (teamMatches.length > 0) {
        const updated = participants.map((p) => {
          if (p.teamColor && p.teamColor.toLowerCase() === id.toLowerCase()) {
            return { ...p, score: (p.score || 0) + Number(points) };
          }
          return p;
        });
        saveState(updated);
        return {
          success: true,
          message: `เพิ่มคะแนน +${points} ให้กับทุกคนในทีม ${id} สำเร็จ!`,
        };
      }

      const found = participants.find((p) => p.id && p.id.toUpperCase() === id.toUpperCase());
      if (!found) return { success: false, message: 'ไม่พบรหัสผู้ร่วมงาน' };

      const updatedUser = {
        ...found,
        score: (found.score || 0) + Number(points),
      };
      const updated = participants.map((p) => (p.id === found.id ? updatedUser : p));
      saveState(updated);
      return {
        success: true,
        message: `เพิ่มคะแนน +${points} ให้กับ ${found.name} เรียบร้อย!`,
        participant: updatedUser,
      };
    }
  };

  // Save activities
  const handleSaveActivity = async (payload) => {
    try {
      const res = await fetch('/api/submit-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = participants.map((p) =>
          p.id === payload.id ? data.participant : p
        );
        saveState(updated);
      }
    } catch {
      const updated = participants.map((p) => {
        if (p.id === payload.id) {
          return {
            ...p,
            quizAnswered: payload.quizAnswered ? true : p.quizAnswered,
            quizScore: (p.quizScore || 0) + (payload.quizScore || 0),
            score: (p.score || 0) + (payload.quizScore || 0),
            costumeInspiration:
              payload.costumeInspiration !== undefined
                ? payload.costumeInspiration
                : p.costumeInspiration,
            joinEveningContest:
              payload.joinEveningContest !== undefined
                ? payload.joinEveningContest
                : p.joinEveningContest,
          };
        }
        return p;
      });
      saveState(updated);
    }
  };

  // Award prize
  const handleAwardPrize = async (id, prizeName) => {
    try {
      const res = await fetch('/api/award-prize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, prizeName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = participants.map((p) => (p.id === id ? data.participant : p));
        saveState(updated);
      }
    } catch {
      const updated = participants.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            wonPrize: true,
            wonPrizeName: prizeName,
          };
        }
        return p;
      });
      saveState(updated);
    }
  };

  // Reset data
  const handleResetData = async (mode) => {
    try {
      const res = await fetch('/api/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        const refreshed = await fetch('/api/participants').then((r) => r.json());
        if (refreshed.data) {
          saveState(refreshed.data);
          return;
        }
      }
    } catch {}

    if (mode === 'all') {
      saveState(SEED_PARTICIPANTS);
    } else if (mode === 'food-only') {
      const updated = participants.map((p) => ({
        ...p,
        foodClaimed: false,
        foodClaimedAt: null,
      }));
      saveState(updated);
    } else if (mode === 'prizes-only') {
      const updated = participants.map((p) => ({
        ...p,
        wonPrize: false,
        wonPrizeName: null,
      }));
      saveState(updated);
    }
  };

  // Add participant
  const handleAddParticipant = async (newObj) => {
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObj),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        saveState([...participants, data.participant]);
        return;
      }
    } catch {}

    const nextId = `TOUR-${(participants.length + 1).toString().padStart(3, '0')}`;
    const p = {
      id: nextId,
      name: newObj.name,
      teamColor: newObj.teamColor,
      busNumber: newObj.busNumber,
      foodClaimed: false,
      foodClaimedAt: null,
      score: 0,
      quizAnswered: false,
      quizScore: 0,
      costumeInspiration: '',
      joinEveningContest: 'no',
      wonPrize: false,
      wonPrizeName: null,
    };
    saveState([...participants, p]);
  };

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    setActiveTab('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setActiveTab('pass');
  };

  const currentParticipant =
    participants.find((p) => p.id === selectedId) || participants[0];

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300 relative selection:bg-emerald-500/20">
        {/* Global Navigation Header */}
        <AppleNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          participants={participants}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isDark={isDark}
          setIsDark={setIsDark}
          isAdminUnlocked={isAdminUnlocked}
          setIsAdminModalOpen={setIsAdminModalOpen}
        />

        {/* Main Tab Views Protected by ErrorBoundary */}
        <main className="flex-1 py-4 sm:py-6">
          <ErrorBoundary>
            <Suspense fallback={<TabLoadingSkeleton />}>
              {activeTab === 'pass' && (
                <DigitalPass
                  participant={currentParticipant}
                  onOpenActivity={(p) => setActivityModalUser(p)}
                  onOpenSchedule={() => setActiveTab('schedule')}
                />
              )}

              {activeTab === 'schedule' && (
                <TripSchedule onNavigateTab={(tab) => setActiveTab(tab)} />
              )}

              {activeTab === 'bus' && (
                <BusActivities
                  participant={currentParticipant}
                  onSaveActivity={handleSaveActivity}
                  onAddScore={handleAddScore}
                  onOpenSpotDifference={() => setActiveTab('diff')}
                />
              )}

              {activeTab === 'diff' && (
                <SpotTheDifference
                  participant={currentParticipant}
                  onAddScore={handleAddScore}
                />
              )}

              {activeTab === 'scanner' && (
                <StaffScanner
                  participants={participants}
                  onClaimFood={handleClaimFood}
                  onAddScore={handleAddScore}
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard participants={participants} />
              )}

              {activeTab === 'luckydraw' && (
                <div className="max-w-4xl mx-auto p-4 text-center">
                  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                      <ShieldLockIcon unlocked={false} className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">
                      ระบบสุ่มรางวัลสำหรับเจ้าหน้าที่และพิธีกรบนเวที
                    </h3>
                    <p className="text-xs text-zinc-500">
                      กรุณาเข้าสู่โหมดผู้ดูแลระบบ (Admin) เพื่อควบคุมการจับรางวัลบนจอโปรเจกเตอร์
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAdminUnlocked) setIsAdminModalOpen(true);
                        else setActiveTab('admin');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold cursor-pointer"
                    >
                      เข้าสู่ระบบ Admin
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <AdminPanel
                  participants={participants}
                  onResetData={handleResetData}
                  onAddParticipant={handleAddParticipant}
                  onLockAdmin={handleLockAdmin}
                  onClaimFood={handleClaimFood}
                  onAddScore={handleAddScore}
                  onAwardPrize={handleAwardPrize}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Activities Modal */}
        <ActivityModal
          participant={activityModalUser}
          isOpen={!!activityModalUser}
          onClose={() => setActivityModalUser(null)}
          onSave={handleSaveActivity}
        />

        {/* Admin Password Lock Modal */}
        <AdminPasscodeModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onUnlock={handleUnlockAdmin}
        />

        {/* Mobile Bottom Navigation Dock */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdminUnlocked={isAdminUnlocked}
          setIsAdminModalOpen={setIsAdminModalOpen}
        />

        {/* Corporate Footer */}
        <footer className="py-8 pb-28 sm:pb-10 border-t border-zinc-200/80 dark:border-zinc-800/80 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-1 px-4">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
            © 2026 บริษัท วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์ จำกัด (VNT Event Organizer Co., Ltd.)
          </p>
          <p className="text-[11px]">
            ระบบบริหารจัดการงานทัวร์และกิจกรรมประจำปี • KoniX (Thailand) Co., Ltd. (25–26 ธันวาคม 2569)
          </p>
        </footer>
      </div>
    </div>
  );
}
