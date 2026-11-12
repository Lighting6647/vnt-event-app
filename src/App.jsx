import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import AppleNavbar from './components/AppleNavbar';
import DigitalPass from './components/DigitalPass';
import ActivityModal from './components/ActivityModal';
import AdminPasscodeModal from './components/AdminPasscodeModal';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ShieldLockIcon, MegaphoneIcon, Volume2Icon } from './components/ui/Icons';
import { SEED_PARTICIPANTS, findParticipantById } from './utils/mockData';
import { playSuccess, playFanfare, playPAChime, playWarning, speakAnnouncement } from './utils/soundEffects';

import TripSchedule from './components/TripSchedule';
import StaffScanner from './components/StaffScanner';
import Leaderboard from './components/Leaderboard';

const BusActivities = lazy(() => import('./components/BusActivities'));
const SpotTheDifference = lazy(() => import('./components/SpotTheDifference'));
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
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) return urlTab;
    } catch {}
    return 'pass';
  });
  const [isDark, setIsDark] = useState(true);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [participants, setParticipants] = useState(() => {
    try {
      const local = localStorage.getItem('tour_participants_data');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.filter(p => Boolean(p && p.id && p.name));
          if (sanitized.length > 0) return sanitized;
        }
      }
    } catch {}
    return SEED_PARTICIPANTS;
  });
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlUser = params.get('user');
      if (urlUser) {
        const cleanUser = urlUser.toUpperCase();
        try {
          localStorage.setItem('vnt_my_user_id', cleanUser);
        } catch {}
        return cleanUser;
      }
      const savedUser = localStorage.getItem('vnt_my_user_id');
      if (savedUser) return savedUser;
    } catch {}
    return SEED_PARTICIPANTS[0]?.id || '500';
  });
  const [activityModalUser, setActivityModalUser] = useState(null);
  const [foodClaimedAlert, setFoodClaimedAlert] = useState(null);
  const [welcomeIdentityToast, setWelcomeIdentityToast] = useState(null);
  const [scoreAlert, setScoreAlert] = useState(null);
  const [broadcastAlert, setBroadcastAlert] = useState(null);
  const [departureCountdown, setDepartureCountdown] = useState(null);
  const [countdownRemaining, setCountdownRemaining] = useState(null);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  // Network Online / Offline Listener
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

  // Send read receipt when attendee acknowledges broadcast announcement
  const handleAcknowledgeBroadcast = async () => {
    if (!broadcastAlert) return;
    const targetBc = broadcastAlert;
    setBroadcastAlert(null);
    try {
      const myId = (selectedIdRef.current || '').toUpperCase();
      const myParticipant = (participantsRef.current || []).find(
        (p) => p && p.id && p.id.toUpperCase() === myId
      );
      await fetch('/api/broadcast/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          broadcastId: targetBc.id,
          userId: myParticipant?.id || myId,
          userName: myParticipant?.name || 'ผู้ร่วมงาน',
          busNumber: myParticipant?.busNumber || 'ไม่ระบุคันรถ',
          teamColor: myParticipant?.teamColor || 'zinc',
        }),
      });
    } catch (e) {
      console.warn('Read receipt ack error:', e);
    }
  };

  // Live interval for Departure Countdown
  useEffect(() => {
    if (!departureCountdown || !departureCountdown.targetTime) {
      setCountdownRemaining(null);
      return;
    }

    const calc = () => {
      const now = new Date();
      let target;
      if (departureCountdown.targetTime.includes(':') && !departureCountdown.targetTime.includes('T')) {
        const [hh, mm] = departureCountdown.targetTime.split(':').map(Number);
        target = new Date();
        target.setHours(hh, mm, 0, 0);
        if (target.getTime() < now.getTime() - 3600000) {
          target.setDate(target.getDate() + 1);
        }
      } else {
        target = new Date(departureCountdown.targetTime);
      }

      const diffSec = Math.floor((target.getTime() - now.getTime()) / 1000);
      if (diffSec <= 0) {
        setCountdownRemaining({ isExpired: true, text: '00:00', totalSeconds: 0 });
      } else {
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;
        const text =
          h > 0
            ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        setCountdownRemaining({ isExpired: false, text, totalSeconds: diffSec });
      }
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [departureCountdown]);

  const selectedIdRef = useRef(selectedId);
  const participantsRef = useRef(participants);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    try {
      localStorage.setItem('vnt_my_user_id', selectedId);
    } catch {}
  }, [selectedId]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  // Parse URL query params on mount (Auto-routing when scanning QR via smartphone camera)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlUser = params.get('user');
      const urlTab = params.get('tab');

      if (urlUser) {
        const cleanUser = String(urlUser).trim();
        setSelectedId(cleanUser);
        try {
          localStorage.setItem('vnt_my_user_id', cleanUser);
        } catch {}

        const matched = findParticipantById(participantsRef.current || SEED_PARTICIPANTS, cleanUser);
        if (matched) {
          setWelcomeIdentityToast({
            name: matched.name,
            id: matched.id,
            teamColor: matched.teamColor,
            busNumber: matched.busNumber,
          });
          setTimeout(() => {
            setWelcomeIdentityToast(null);
          }, 4500);
        }
      }
      if (urlTab) {
        setActiveTab(urlTab);
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }
  }, []);

  // Auto-dismiss score alert after 6 seconds
  useEffect(() => {
    if (!scoreAlert) return;
    const timer = setTimeout(() => {
      setScoreAlert(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [scoreAlert]);

  // Sync to backend if running (with Real-time SSE support)
  useEffect(() => {
    // 1. Initial fetch
    fetch('/api/participants')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const sanitized = res.data.filter(p => Boolean(p && p.id && p.name));
          if (sanitized.length > 0) {
            saveState(sanitized);
          }
        }
      })
      .catch(() => {});

    // Check for active broadcast announcement on mount
    fetch('/api/broadcast/current')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.broadcast) {
          setBroadcastAlert(res.broadcast);
        }
      })
      .catch(() => {});

    // Check for active departure countdown on mount
    fetch('/api/countdown/current')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.countdown) {
          setDepartureCountdown(res.countdown);
        }
      })
      .catch(() => {});

    // 2. Real-time Server-Sent Events (SSE) Listener
    let eventSource;
    try {
      eventSource = new EventSource('/api/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.data && Array.isArray(payload.data)) {
            const sanitized = payload.data.filter(p => Boolean(p && p.id && p.name));
            if (sanitized.length > 0) {
              saveState(sanitized);
            }

            if (payload.currentBroadcast) {
              setBroadcastAlert(payload.currentBroadcast);
            }

            if (payload.event) {
              const ev = payload.event;
              const myId = (selectedIdRef.current || '').toUpperCase();
              const myParticipant = (participantsRef.current || []).find(
                (p) => p && p.id && p.id.toUpperCase() === myId
              );

              // 1. Point award to individual user
              if (ev.action === 'add-score-user' && ev.targetId) {
                if (ev.targetId.toUpperCase() === myId) {
                  playFanfare();
                  try {
                    navigator.vibrate?.([150, 80, 150]);
                  } catch {}
                  setScoreAlert({
                    title: `🎉 คุณได้รับแต้มเพิ่ม +${ev.points} คะแนน!`,
                    message: `ขอแสดงความยินดีด้วยค่ะ คณะผู้จัดงานได้เติมคะแนนให้คุณ (${ev.name || myId}) เรียบร้อยแล้ว`,
                    points: ev.points,
                    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                  });
                }
              }

              // 2. Point award to team
              else if (ev.action === 'add-score-team' && ev.teamColor) {
                const myTeam = myParticipant?.teamColor;
                if (myTeam && myTeam.toLowerCase() === ev.teamColor.toLowerCase()) {
                  playFanfare();
                  try {
                    navigator.vibrate?.([150, 80, 150]);
                  } catch {}
                  setScoreAlert({
                    title: `🏆 ทีมของคุณได้รับ +${ev.points} คะแนน!`,
                    message: `ทีม${ev.teamColor} ได้รับคะแนนสะสมพิเศษจากคณะผู้จัดงาน (${ev.reason || 'ภารกิจกิจกรรม'})`,
                    points: ev.points,
                    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                  });
                }
              }

              // 3. Instant In-App Food Claim Notification for the active user
              else if (ev.action === 'claim-food' && ev.targetId) {
                if (ev.targetId.toUpperCase() === myId) {
                  playSuccess();
                  setFoodClaimedAlert({
                    title: '🥪 รับอาหารเช้าสำเร็จเรียบร้อย!',
                    message: `ขอให้อร่อยกับมื้อเช้าค่ะ คุณ ${ev.name || ''}`,
                    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                  });
                  try {
                    navigator.vibrate?.([200, 100, 200]);
                  } catch {}
                }
              }

              // 4. Live Public Address (PA) Broadcast Announcement
              else if (ev.action === 'broadcast-announcement' && ev.broadcast) {
                const bc = ev.broadcast;
                const myBus = myParticipant?.busNumber || '';
                const isTargeted =
                  !bc.targetBus ||
                  bc.targetBus === 'all' ||
                  myBus.toLowerCase().includes(bc.targetBus.toLowerCase());

                if (isTargeted) {
                  if (bc.soundType === 'warning') {
                    playWarning();
                  } else {
                    playPAChime();
                  }

                  if (bc.soundType === 'speech' || bc.urgency === 'urgent') {
                    setTimeout(() => {
                      speakAnnouncement(`${bc.title}. ${bc.message}`);
                    }, 800);
                  }

                  try {
                    navigator.vibrate?.([250, 100, 250, 100, 400]);
                  } catch {}

                  setBroadcastAlert(bc);
                }
              }

              // 5. Clear broadcast
              else if (ev.action === 'broadcast-clear') {
                setBroadcastAlert(null);
              }

              // 6. Departure Countdown Live Update
              else if (ev.action === 'departure-countdown' && ev.countdown) {
                setDepartureCountdown(ev.countdown);
                playPAChime();
              }

              // 7. Clear Departure Countdown
              else if (ev.action === 'departure-countdown-clear') {
                setDepartureCountdown(null);
                setCountdownRemaining(null);
              }
            }
          }
        } catch (e) {
          console.error('SSE JSON parse error:', e);
        }
      };
      eventSource.onerror = () => {
        // Auto fallback handled by browser EventSource reconnect
      };
    } catch (e) {
      console.warn('SSE not supported or failed to connect:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const saveState = (updatedList) => {
    const sanitized = (updatedList || []).filter((p) => Boolean(p && p.id && p.name));
    setParticipants(sanitized);
    try {
      localStorage.setItem('tour_participants_data', JSON.stringify(sanitized));
    } catch {}
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
      if (res.ok && data.success && data.participant) {
        const updated = participants.map((p) => (p?.id === id ? data.participant : p));
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
      if (res.ok && data.success && data.participant) {
        const updated = participants.map((p) =>
          p?.id === payload.id ? data.participant : p
        );
        saveState(updated);
      }
    } catch {
      const updated = participants.map((p) => {
        if (p && p.id === payload.id) {
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
      if (res.ok && data.success && data.participant) {
        const updated = participants.map((p) => (p?.id === id ? data.participant : p));
        saveState(updated);
      }
    } catch {
      const updated = participants.map((p) => {
        if (p && p.id === id) {
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
      if (res.ok && data.success && data.participant) {
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

  // Delete participant
  const handleDeleteParticipant = async (id) => {
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = participants.filter((p) => p && p.id !== id);
        saveState(updated);
        if (selectedId === id && updated.length > 0) {
          setSelectedId(updated[0].id);
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'ลบข้อมูลไม่สำเร็จ' };
    } catch {
      const updated = participants.filter((p) => p && p.id !== id);
      saveState(updated);
      if (selectedId === id && updated.length > 0) {
        setSelectedId(updated[0].id);
      }
      return { success: true, message: 'ลบรายชื่อสำเร็จ' };
    }
  };

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    setActiveTab('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setActiveTab('pass');
  };

  const currentParticipant = useMemo(() => {
    return findParticipantById(participants, selectedId);
  }, [participants, selectedId]);

  // Auto-bind identity: persist verified user ID to localStorage so reloads keep identity
  useEffect(() => {
    if (currentParticipant?.id) {
      try {
        localStorage.setItem('vnt_my_user_id', String(currentParticipant.id));
      } catch {}
    }
  }, [currentParticipant]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors duration-300 relative selection:bg-emerald-500/20">
        {/* Global Navigation Header */}
        <AppleNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          participants={participants}
          currentParticipant={currentParticipant}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isDark={isDark}
          setIsDark={setIsDark}
          isAdminUnlocked={isAdminUnlocked}
          setIsAdminModalOpen={setIsAdminModalOpen}
        />

        {/* Offline Mode Active Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-zinc-950 px-4 py-1 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-xs z-40">
            <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
            <span>⚡ โหมดออฟไลน์: บัตรดิจิทัลและแผนผังกำหนดการเดินทางถูกแคชไว้ในเครื่อง สามารถเปิดดูได้ตามปกติ</span>
          </div>
        )}

        {/* Live Departure Countdown Timer Banner */}
        {departureCountdown && countdownRemaining && (
          <div
            className={`w-full border-b transition-all animate-in slide-in-from-top-2 duration-300 z-40 ${
              countdownRemaining.totalSeconds <= 300 && !countdownRemaining.isExpired
                ? 'bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300'
                : countdownRemaining.isExpired
                ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base animate-bounce">🚌</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">
                  {departureCountdown.title}
                </span>
                <span className="font-mono px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px]">
                  เวลารถออก: {departureCountdown.targetTime} น.
                </span>
                {departureCountdown.targetBus !== 'all' && (
                  <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                    ({departureCountdown.targetBus})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {countdownRemaining.isExpired ? (
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-xs">
                    ⛔ รถบัสพร้อมออกเดินทางแล้ว
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 font-mono font-black text-sm">
                    <span className="text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400">เหลือเวลาอีก:</span>
                    <span
                      className={`px-3 py-0.5 rounded-xl border text-xs sm:text-sm font-bold shadow-xs ${
                        countdownRemaining.totalSeconds <= 300
                          ? 'bg-red-600 text-white border-red-500 animate-pulse'
                          : 'bg-white dark:bg-zinc-800 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      ⏱️ {countdownRemaining.text}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                  onNavigateTab={(tab) => setActiveTab(tab)}
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
                  onDeleteParticipant={handleDeleteParticipant}
                  onLockAdmin={handleLockAdmin}
                  onClaimFood={handleClaimFood}
                  onAddScore={handleAddScore}
                  onAwardPrize={handleAwardPrize}
                  onNavigateTab={(tab) => setActiveTab(tab)}
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

        {/* Live Public Address (PA) Broadcast Announcement Modal */}
        {broadcastAlert && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative max-w-md w-full bg-zinc-950 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-4 overflow-hidden">
              {/* Background Ambient Glow */}
              <div
                className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                  broadcastAlert.urgency === 'urgent'
                    ? 'bg-red-500/25'
                    : broadcastAlert.urgency === 'countdown'
                    ? 'bg-amber-500/25'
                    : 'bg-emerald-500/25'
                }`}
              />

              {/* Header Badge & Sound Equalizer Wave */}
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      broadcastAlert.urgency === 'urgent'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : broadcastAlert.urgency === 'countdown'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    <MegaphoneIcon className="w-3.5 h-3.5 animate-bounce" />
                    <span>เสียงตามสายจากฝ่ายจัดงาน</span>
                  </span>
                </div>

                {/* Animated 3-Bar Audio Wave Indicator */}
                <div className="flex items-end gap-1 h-4 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800" title="กำลังถ่ายทอดสด">
                  <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3.5" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                </div>
              </div>

              {/* Main Broadcast Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                    🎯 เป้าหมาย: {broadcastAlert.targetBus === 'all' || !broadcastAlert.targetBus ? 'ผู้ร่วมงานทุกคน' : broadcastAlert.targetBus}
                  </span>
                  <span>{broadcastAlert.formattedTime || new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-zinc-50 tracking-tight leading-snug">
                  {broadcastAlert.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/80 whitespace-pre-line">
                  {broadcastAlert.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (broadcastAlert.soundType === 'warning') {
                      playWarning();
                    } else {
                      playPAChime();
                    }
                    speakAnnouncement(`${broadcastAlert.title}. ${broadcastAlert.message}`);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
                >
                  <Volume2Icon className="w-4 h-4 text-emerald-400" />
                  <span>ฟังเสียงประกาศซ้ำ</span>
                </button>

                <button
                  type="button"
                  onClick={handleAcknowledgeBroadcast}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-900/40"
                >
                  รับทราบแล้ว (ปิด)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendee Auto-Bind Identity Welcome Toast */}
        {welcomeIdentityToast && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] animate-in slide-in-from-top-3 fade-in duration-300 pointer-events-auto">
            <div className="bg-emerald-600 dark:bg-emerald-500 p-[1.5px] rounded-2xl shadow-2xl">
              <div className="bg-white dark:bg-zinc-950 rounded-[15px] p-3 sm:p-4 text-zinc-900 dark:text-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold truncate">
                    จดจำชื่อผู้ใช้งานสำเร็จ: {welcomeIdentityToast.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate font-medium">
                    รหัสประจำตัว: {welcomeIdentityToast.id} • {welcomeIdentityToast.busNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWelcomeIdentityToast(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Score Notification Toast Banner */}
        {scoreAlert && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
            <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-500 p-[2px] rounded-3xl shadow-2xl">
              <div className="bg-zinc-950/95 backdrop-blur-md rounded-[22px] p-4 sm:p-5 text-white flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl shrink-0 animate-bounce">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-extrabold text-amber-300 tracking-tight">
                      {scoreAlert.title}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400">{scoreAlert.time} น.</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2">
                    {scoreAlert.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setScoreAlert(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-time In-App Food Claim Notification Modal */}
        {foodClaimedAlert && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl">
                🥪
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {foodClaimedAlert.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {foodClaimedAlert.message}
                </p>
                <span className="text-[11px] font-mono text-zinc-400 block pt-1">
                  บันทึกเวลา: {foodClaimedAlert.time} น.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFoodClaimedAlert(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                รับทราบ และปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}

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
