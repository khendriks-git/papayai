let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playBell(frequency = 432, duration = 3, volume = 0.6) {
  const ctx = getAudioContext();

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Main tone oscillator
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Harmonics for richer bell tone
  const osc2 = ctx.createOscillator();
  const gainNode2 = ctx.createGain();

  const osc3 = ctx.createOscillator();
  const gainNode3 = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(frequency * 2.756, now); // Inharmonic partial

  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(frequency * 5.404, now); // Higher partial

  // Bell envelope: sharp attack, long exponential decay
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  gainNode2.gain.setValueAtTime(0, now);
  gainNode2.gain.linearRampToValueAtTime(volume * 0.4, now + 0.01);
  gainNode2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

  gainNode3.gain.setValueAtTime(0, now);
  gainNode3.gain.linearRampToValueAtTime(volume * 0.15, now + 0.01);
  gainNode3.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.3);

  osc.connect(gainNode);
  osc2.connect(gainNode2);
  osc3.connect(gainNode3);

  gainNode.connect(ctx.destination);
  gainNode2.connect(ctx.destination);
  gainNode3.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);

  osc2.start(now);
  osc2.stop(now + duration);

  osc3.start(now);
  osc3.stop(now + duration);
}

export function playStartBell() {
  // Three gentle ascending bells
  setTimeout(() => playBell(396, 2.5, 0.5), 0);
  setTimeout(() => playBell(432, 2.5, 0.5), 600);
  setTimeout(() => playBell(528, 3, 0.6), 1200);
}

export function playEndBell() {
  // Three descending bells to signal completion
  setTimeout(() => playBell(528, 3, 0.6), 0);
  setTimeout(() => playBell(432, 3, 0.5), 800);
  setTimeout(() => playBell(396, 4, 0.4), 1600);
}

export function playSingleBell() {
  playBell(432, 3, 0.5);
}
