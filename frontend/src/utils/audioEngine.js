// ============================================================
// QuizVerse AI — Web Audio API Synthesized Sound Engine
// ============================================================

let audioCtx = null;
let isMuted = false;

// Lazily initialize audio context to respect browser auto-play policies
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(console.error);
  }
  return audioCtx;
}

// Internal helper to play a pure synthesized frequency tone
function playTone({ frequency, duration, type = 'sine', volume = 0.15, startDelay = 0, pitchSlideTarget = null }) {
  if (isMuted) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const startTime = now + startDelay;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  
  if (pitchSlideTarget) {
    osc.frequency.exponentialRampToValueAtTime(pitchSlideTarget, startTime + duration);
  }

  // Soft fade-in and exponential decay to prevent speaker pops
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

export const audioEngine = {
  // Set muted state
  setMuted(muted) {
    isMuted = muted;
  },

  // Get current muted state
  getMuted() {
    return isMuted;
  },

  // Dynamic user click sound
  playClick() {
    playTone({
      frequency: 700,
      duration: 0.05,
      type: 'sine',
      volume: 0.08,
    });
  },

  // Sound when clicking "Ready" or lobby transitions
  playReady() {
    const ctx = getAudioContext();
    if (!ctx || isMuted) return;
    const now = 0;
    
    // Play ascending arpeggio C4 -> E4 -> G4 -> C5
    playTone({ frequency: 261.63, duration: 0.12, type: 'triangle', volume: 0.12, startDelay: now });
    playTone({ frequency: 329.63, duration: 0.12, type: 'triangle', volume: 0.12, startDelay: now + 0.08 });
    playTone({ frequency: 392.00, duration: 0.12, type: 'triangle', volume: 0.12, startDelay: now + 0.16 });
    playTone({ frequency: 523.25, duration: 0.25, type: 'triangle', volume: 0.15, startDelay: now + 0.24 });
  },

  // Upbeat happy double-chime for correct answer
  playCorrect() {
    const ctx = getAudioContext();
    if (!ctx || isMuted) return;
    
    playTone({ frequency: 587.33, duration: 0.1, type: 'sine', volume: 0.12, startDelay: 0 }); // D5
    playTone({ frequency: 880.00, duration: 0.25, type: 'sine', volume: 0.15, startDelay: 0.08 }); // A5
  },

  // Deep descending electronic buzz for wrong answers
  playWrong() {
    playTone({
      frequency: 180,
      duration: 0.35,
      type: 'sawtooth',
      volume: 0.1,
      pitchSlideTarget: 70,
    });
  },

  // Tick pop for final countdown seconds
  playTick(isFinal = false) {
    playTone({
      frequency: isFinal ? 1100 : 550,
      duration: 0.08,
      type: 'sine',
      volume: isFinal ? 0.15 : 0.08,
    });
  },

  // Upbeat arcade fanfare played on Game Over
  playVictory() {
    const ctx = getAudioContext();
    if (!ctx || isMuted) return;
    
    const baseDelay = 0;
    const step = 0.12;
    
    // Triumphant melody resolving to dynamic major chord
    playTone({ frequency: 523.25, duration: 0.12, type: 'triangle', volume: 0.1, startDelay: baseDelay }); // C5
    playTone({ frequency: 659.25, duration: 0.12, type: 'triangle', volume: 0.1, startDelay: baseDelay + step }); // E5
    playTone({ frequency: 783.99, duration: 0.12, type: 'triangle', volume: 0.1, startDelay: baseDelay + step * 2 }); // G5
    playTone({ frequency: 1046.50, duration: 0.12, type: 'triangle', volume: 0.1, startDelay: baseDelay + step * 3 }); // C6
    
    // Harmonized C-major chord burst
    playTone({ frequency: 783.99, duration: 0.5, type: 'triangle', volume: 0.08, startDelay: baseDelay + step * 4.5 }); // G5
    playTone({ frequency: 1046.50, duration: 0.5, type: 'triangle', volume: 0.12, startDelay: baseDelay + step * 4.5 }); // C6
  }
};
