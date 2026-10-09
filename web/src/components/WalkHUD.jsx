import React from 'react';
import { Footprints, EyeOff, RotateCcw, Pause, Play, Compass, ArrowRight, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAudioEngine } from '../context/AudioEngineContext';

export function WalkHUD({ totalDistance = 0, gpsStatus, speed, accuracy }) {
  const {
    selectedStory,
    metersRemaining,
    checkpointProgress,
    targetDistanceForNextNode,
    segmentWalked,
    setIsPocketMode,
    quitAdventure
  } = useGame();

  const { speak, isSpeaking, isPaused, pause, resume, currentSubtitle } = useAudioEngine();

  const handleRepeatNarration = () => {
    if (currentSubtitle) {
      speak(currentSubtitle, { priority: true });
    }
  };

  const speedKmh = speed ? (speed * 3.6).toFixed(1) : '0.0';

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '580px', margin: '0 auto' }}>
      {/* Top Banner: Story Title & Quit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Active Walk
          </span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedStory?.title}</h2>
        </div>
        <button
          onClick={quitAdventure}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--rose-500)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            cursor: 'pointer'
          }}
        >
          End Walk
        </button>
      </div>

      {/* Tactical Center Audio Radar */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <div className="radar-container" style={{ marginBottom: '1.5rem' }}>
          <div className="radar-ring pulse-1" />
          <div className="radar-ring pulse-2" />
          <div className="radar-ring core">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                {metersRemaining}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Meters to Next
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-400)', marginBottom: '0.4rem' }}>
            <span>Checkpoint Progress</span>
            <span className="mono" style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>{checkpointProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${checkpointProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--emerald-500), var(--cyan-500))',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Real-time stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', display: 'block' }}>TOTAL DISTANCE</span>
            <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
              {Math.round(totalDistance)} m
            </span>
          </div>
          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', display: 'block' }}>WALK SPEED</span>
            <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan-500)' }}>
              {speedKmh} km/h
            </span>
          </div>
          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', display: 'block' }}>GPS STATUS</span>
            <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: gpsStatus === 'active' ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
              {gpsStatus === 'active' ? 'Locked' : gpsStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Subtitles & Narration Box */}
      <div
        className="glass-panel"
        style={{
          padding: '1.15rem',
          marginBottom: '1.25rem',
          borderLeft: '3px solid var(--cyan-500)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--cyan-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Audio Narration
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleRepeatNarration}
              title="Repeat Narration"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                color: 'var(--slate-300)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem'
              }}
            >
              <RotateCcw size={13} /> Repeat
            </button>
            <button
              onClick={isPaused ? resume : pause}
              title={isPaused ? 'Resume' : 'Pause'}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                color: 'var(--slate-300)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem'
              }}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />} {isPaused ? 'Play' : 'Pause'}
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--slate-200)', fontStyle: 'italic' }}>
          "{currentSubtitle || 'Walking to next checkpoint... Keep walking to advance the story.'}"
        </p>
      </div>

      {/* Pocket Mode / Zero-Screen Button */}
      <div>
        <button
          onClick={() => setIsPocketMode(true)}
          className="btn-primary"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid var(--emerald-500)',
            color: 'var(--emerald-400)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
          }}
        >
          <EyeOff size={18} />
          ENTER POCKET MODE (SCREEN OFF / BATTERY SAVER)
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>
          💡 Maximize your Touch Grass Score by keeping the screen off while walking.
        </p>
      </div>
    </div>
  );
}
