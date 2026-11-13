// Web Audio API Synthetic Sound Effects & Multi-Voice AI TTS Engine
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 10 Distinct AI Voice Profiles (Incorporating Google Gemini Voice Models & Stage Personas)
 */
export const AI_VOICES = [
  {
    id: 'gemini-aoede',
    name: 'Google Gemini (Aoede)',
    gender: 'female',
    desc: 'เสียงใส คมชัด เป็นมิตร พลังบวก สไตล์ Google AI',
    pitch: 1.18,
    rate: 1.05,
    tag: 'Gemini AI',
    sample: 'สวัสดีค่ะ ยินดีต้อนรับสู่ระบบกิจกรรมทัวร์ 2026 ค่ะ',
  },
  {
    id: 'gemini-kore',
    name: 'Google Gemini (Kore)',
    gender: 'female',
    desc: 'เสียงนุ่มนวล อบอุ่น สุภาพ ทางการ สไตล์ผู้ช่วยส่วนตัว',
    pitch: 1.00,
    rate: 0.98,
    tag: 'Gemini AI',
    sample: 'ยินดีที่ได้ดูแลคุณในทริปนี้ ขอให้มีความสุขตลอดการเดินทางค่ะ',
  },
  {
    id: 'gemini-puck',
    name: 'Google Gemini (Puck)',
    gender: 'male',
    desc: 'เสียงกระตือรือร้น สดใส สนุกสนาน คึกคัก มีชีวิตชีวา',
    pitch: 1.12,
    rate: 1.12,
    tag: 'Gemini AI',
    sample: 'พร้อมลุยกิจกรรมสนุกๆ และลุ้นของรางวัลใหญ่ไปด้วยกันแล้วครับ!',
  },
  {
    id: 'gemini-fenrir',
    name: 'Google Gemini (Fenrir)',
    gender: 'male',
    desc: 'เสียงทุ้มลึก ทรงพลัง หนักแน่น น่าเชื่อถือ',
    pitch: 0.80,
    rate: 0.96,
    tag: 'Gemini AI',
    sample: 'ระบบจัดการข้อมูลและกำหนดการเดินทาง พร้อมปฏิบัติการแล้วครับ',
  },
  {
    id: 'gemini-charon',
    name: 'Google Gemini (Charon)',
    gender: 'male',
    desc: 'เสียงสุขุม นิ่ง คลาสสิก สไตล์ผู้ประกาศข่าวมืออาชีพ',
    pitch: 0.92,
    rate: 1.02,
    tag: 'Gemini AI',
    sample: 'ขอต้อนรับผู้ร่วมงานทุกท่าน สู่การเดินทางอันน่าประทับใจครับ',
  },
  {
    id: 'stage-mc-female',
    name: 'สปีกเกอร์เวทีหญิง (Stage MC)',
    gender: 'female',
    desc: 'เสียงก้องกังวานสำหรับฮอลล์จัดเลี้ยง ขานชื่อผู้ชนะชัดเจน',
    pitch: 1.24,
    rate: 1.04,
    tag: 'Stage MC',
    sample: 'ขอแสดงความยินดีกับผู้โชคดีที่ได้รับรางวัลใหญ่บนเวทีค่าาา!',
  },
  {
    id: 'stage-mc-male',
    name: 'สปีกเกอร์เวทีชาย (Stage MC)',
    gender: 'male',
    desc: 'เสียงหนักแน่น ปลุกใจ เปิดตัวผู้ชนะรางวัลใหญ่ก้องเวที',
    pitch: 0.86,
    rate: 1.06,
    tag: 'Stage MC',
    sample: 'ช่วงเวลาแห่งความระทึกใจ ขอเปิดตัวผู้โชคดีประจำค่ำคืนนี้คร้าบบบ!',
  },
  {
    id: 'party-dj',
    name: 'ดีเจงานปาร์ตี้ (Party DJ)',
    gender: 'male',
    desc: 'จังหวะเร็ว สนุก ตื่นเต้น เหมาะกับงานเลี้ยงสังสรรค์',
    pitch: 1.15,
    rate: 1.18,
    tag: 'Party DJ',
    sample: 'เฮฮาจัดเต็ม ปาร์ตี้สุดมันส์ไปกับพวกเราเลยครับผม!',
  },
  {
    id: 'pa-announcer',
    name: 'แอร์โฮสเตส / บรอดแคสต์ (PA Flight)',
    gender: 'female',
    desc: 'เสียงนุ่มละมุน ชัดเจน สไตล์ประกาศสนามบินและรถบัส VIP',
    pitch: 1.06,
    rate: 0.92,
    tag: 'Public Address',
    sample: 'ท่านผู้โดยสารโปรดทราบ รถบัสทุกคันพร้อมออกเดินทางแล้วค่ะ',
  },
  {
    id: 'cyber-jarvis',
    name: 'หุ่นยนต์ AI จาวิส (Cyber Jarvis)',
    gender: 'male',
    desc: 'เสียงสังเคราะห์ไฮเทค ล้ำสมัย คมกริบสไตล์โลกอนาคต',
    pitch: 0.72,
    rate: 1.08,
    tag: 'AI System',
    sample: 'ระบบ AI จาวิส เชื่อมต่อข้อมูลเรียบร้อย พร้อมให้บริการครับท่าน',
  },
];

const STORAGE_VOICE_KEY = 'vnt_tts_voice_id';

/**
 * Get the currently active Voice ID
 */
export function getCurrentVoiceId() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_VOICE_KEY);
      if (saved && AI_VOICES.some((v) => v.id === saved)) {
        return saved;
      }
    }
  } catch {}
  return 'gemini-aoede';
}

/**
 * Save selected Voice ID
 */
export function setCurrentVoiceId(voiceId) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_VOICE_KEY, voiceId);
    }
  } catch {}
}

/**
 * Text-to-Speech: Voice announcement with chosen AI voice model profile
 */
export function speakAnnouncement(text, voiceIdOverride = null) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending speech immediately

    const activeVoiceId = voiceIdOverride || getCurrentVoiceId();
    const profile = AI_VOICES.find((v) => v.id === activeVoiceId) || AI_VOICES[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = 1.0;

    // Pick best matching browser voice for Thai & gender
    const voices = window.speechSynthesis.getVoices();
    const thaiVoices = voices.filter(
      (v) =>
        v.lang?.toLowerCase().includes('th') ||
        v.lang?.toLowerCase().includes('thai') ||
        v.name?.toLowerCase().includes('thai')
    );

    if (thaiVoices.length > 0) {
      if (profile.gender === 'male') {
        const maleVoice = thaiVoices.find(
          (v) =>
            v.name.toLowerCase().includes('niwat') ||
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('man') ||
            v.name.toLowerCase().includes('david')
        );
        utterance.voice = maleVoice || thaiVoices[0];
      } else {
        const femaleVoice = thaiVoices.find(
          (v) =>
            v.name.toLowerCase().includes('premwadee') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('kanya') ||
            v.name.toLowerCase().includes('narisa')
        );
        utterance.voice = femaleVoice || thaiVoices[0];
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS voice error:', e);
  }
}

/**
 * Preview / Test play a voice sample
 */
export function previewVoice(voiceId) {
  const profile = AI_VOICES.find((v) => v.id === voiceId);
  if (!profile) return;
  speakAnnouncement(profile.sample, voiceId);
}

/**
 * Play a ticking / click sound for the lucky draw reel
 */
export function playTick(pitch = 600) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn('Audio tick error', e);
  }
}

/**
 * Play a positive ding sound (e.g. food claimed, quiz correct, points awarded)
 */
export function playSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.5);
  } catch (e) {
    console.warn('Audio success error', e);
  }
}

/**
 * Play a warning buzzer sound (e.g. food already claimed, duplicate scan)
 */
export function playWarning() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn('Audio warning error', e);
  }
}

/**
 * Play an epic triumph fanfare when the winner is revealed!
 */
export function playFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.15 }, // C5
      { f: 523.25, t: 0.18, d: 0.15 }, // C5
      { f: 523.25, t: 0.36, d: 0.15 }, // C5
      { f: 659.25, t: 0.54, d: 0.35 }, // E5
      { f: 783.99, t: 0.92, d: 0.2 }, // G5
      { f: 1046.5, t: 1.15, d: 0.8 }, // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.3, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  } catch (e) {
    console.warn('Audio fanfare error', e);
  }
}

/**
 * Play Public Address (PA) / Airport-style Chime for broadcast announcements
 */
export function playPAChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const tones = [
      { freq: 293.66, start: 0.0, dur: 0.35, gain: 0.22 },
      { freq: 369.99, start: 0.18, dur: 0.35, gain: 0.25 },
      { freq: 440.0, start: 0.36, dur: 0.4, gain: 0.28 },
      { freq: 587.33, start: 0.54, dur: 0.85, gain: 0.32 },
    ];

    tones.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(t.freq, now + t.start);

      gain.gain.setValueAtTime(t.gain, now + t.start);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t.start + t.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t.start);
      osc.stop(now + t.start + t.dur);
    });
  } catch (e) {
    console.warn('PA Chime error', e);
  }
}
