// Web Audio API Synthetic Sound Effects (No external files needed)
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
      { f: 783.99, t: 0.92, d: 0.2 },  // G5
      { f: 1046.50, t: 1.15, d: 0.8 }, // C6
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
 * Text-to-Speech: Voice announcement for staff scan confirmation
 */
export function speakAnnouncement(text) {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select Thai voice if available
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find(v => v.lang.includes('th') || v.lang.includes('TH'));
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    console.warn('TTS voice error:', e);
  }
}
