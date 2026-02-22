import { useState, useEffect, useRef, useCallback } from 'react';
import { playStartBell, playEndBell } from '../utils/sound';
import { saveSession } from '../utils/storage';

const PRESETS = [5, 10, 20, 30];

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ onSessionStart, onSessionComplete }) {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | running | paused | done
  const [breathPhase, setBreathPhase] = useState('in'); // for breathing animation

  const intervalRef = useRef(null);
  const breathIntervalRef = useRef(null);
  const sessionStartRef = useRef(null);

  const progress = secondsLeft !== null && totalSeconds
    ? (totalSeconds - secondsLeft) / totalSeconds
    : 0;

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Breathing animation cycle (4s in, 4s out)
  useEffect(() => {
    if (phase === 'running') {
      let t = 0;
      breathIntervalRef.current = setInterval(() => {
        t += 1;
        setBreathPhase(t % 8 < 4 ? 'in' : 'out');
      }, 1000);
    } else {
      clearInterval(breathIntervalRef.current);
      setBreathPhase('in');
    }
    return () => clearInterval(breathIntervalRef.current);
  }, [phase]);

  const tick = useCallback(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setPhase('done');
        setIsRunning(false);
        playEndBell();
        const duration = totalSeconds;
        const session = saveSession({
          duration,
          minutes: Math.floor(duration / 60),
        });
        if (onSessionComplete) onSessionComplete(session);
        return 0;
      }
      return prev - 1;
    });
  }, [totalSeconds, onSessionComplete]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, tick]);

  function handleStart() {
    const minutes = customMinutes ? parseInt(customMinutes, 10) : selectedMinutes;
    if (!minutes || minutes < 1 || minutes > 120) return;
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(true);
    setIsPaused(false);
    setPhase('running');
    sessionStartRef.current = Date.now();
    if (onSessionStart) onSessionStart();
    playStartBell();
  }

  function handlePause() {
    setIsPaused(true);
    setPhase('paused');
  }

  function handleResume() {
    setIsPaused(false);
    setPhase('running');
  }

  function handleStop() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setPhase('idle');
    setSecondsLeft(null);
    setTotalSeconds(null);
    setCustomMinutes('');
  }

  function handleReset() {
    handleStop();
  }

  function formatTime(secs) {
    if (secs === null) {
      const m = customMinutes ? parseInt(customMinutes, 10) : selectedMinutes;
      return `${String(m).padStart(2, '0')}:00`;
    }
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function handleCustomInput(e) {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 120)) {
      setCustomMinutes(val);
    }
  }

  const activeMinutes = customMinutes ? parseInt(customMinutes) : selectedMinutes;

  return (
    <div className="timer-card">
      <div className="timer-header">
        <h2 className="timer-title">Meditatietimer</h2>
        <p className="timer-subtitle">
          {phase === 'idle' && 'Kies je duur en begin'}
          {phase === 'running' && (breathPhase === 'in' ? 'Adem in...' : 'Adem uit...')}
          {phase === 'paused' && 'Gepauzeerd'}
          {phase === 'done' && 'Sessie voltooid'}
        </p>
      </div>

      {/* Circular Timer */}
      <div className={`timer-ring-container ${phase === 'running' ? `breath-${breathPhase}` : ''}`}>
        <svg className="timer-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          {/* Background ring */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="var(--ring-bg)"
            strokeWidth="4"
          />
          {/* Progress ring */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 110 110)"
            className="progress-ring"
          />
        </svg>

        <div className="timer-display">
          <span className="timer-time">{formatTime(secondsLeft)}</span>
          {phase === 'idle' && (
            <span className="timer-label">minuten</span>
          )}
          {phase === 'running' && (
            <span className="timer-label">
              {Math.ceil((secondsLeft || 0) / 60)} min over
            </span>
          )}
          {phase === 'done' && (
            <span className="timer-label done-label">voltooid</span>
          )}
        </div>
      </div>

      {/* Duration selection - only when idle */}
      {phase === 'idle' && (
        <div className="duration-section">
          <div className="presets">
            {PRESETS.map(min => (
              <button
                key={min}
                className={`preset-btn ${!customMinutes && activeMinutes === min ? 'active' : ''}`}
                onClick={() => { setSelectedMinutes(min); setCustomMinutes(''); }}
              >
                {min} min
              </button>
            ))}
          </div>
          <div className="custom-duration">
            <input
              type="number"
              className="custom-input"
              placeholder="Eigen duur..."
              value={customMinutes}
              onChange={handleCustomInput}
              min="1"
              max="120"
            />
            <span className="custom-unit">min</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="timer-controls">
        {phase === 'idle' && (
          <button className="btn-primary" onClick={handleStart}>
            Begin
          </button>
        )}
        {phase === 'running' && (
          <>
            <button className="btn-secondary" onClick={handlePause}>Pauzeer</button>
            <button className="btn-ghost" onClick={handleStop}>Stop</button>
          </>
        )}
        {phase === 'paused' && (
          <>
            <button className="btn-primary" onClick={handleResume}>Hervat</button>
            <button className="btn-ghost" onClick={handleStop}>Stop</button>
          </>
        )}
        {phase === 'done' && (
          <button className="btn-primary" onClick={handleReset}>
            Nieuwe sessie
          </button>
        )}
      </div>

      {phase === 'done' && (
        <div className="completion-message">
          <p>Prachtig gedaan. Neem een moment om terug te keren.</p>
        </div>
      )}
    </div>
  );
}
