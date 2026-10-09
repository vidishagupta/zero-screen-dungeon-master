import React from 'react';
import { ArrowLeft, ArrowRight, Volume2, HelpCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAudioEngine } from '../context/AudioEngineContext';

export function BlindDecisionZone() {
  const { currentCheckpoint, makeChoice } = useGame();
  const { speak, isSpeaking } = useAudioEngine();

  if (!currentCheckpoint) return null;

  const leftChoice = currentCheckpoint.choices.find((c) => c.key === 'left');
  const rightChoice = currentCheckpoint.choices.find((c) => c.key === 'right');

  const handleRepeatPrompt = (e) => {
    e.stopPropagation();
    const text = `${currentCheckpoint.narration} ${currentCheckpoint.prompt}`;
    speak(text, { priority: true });
  };

  return (
    <div className="decision-split-screen animate-fade-in">
      {/* Top Banner Notice */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          zIndex: 60,
          background: 'rgba(9, 13, 22, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--amber-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Checkpoint Reached
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-200)', maxWidth: '400px' }}>
            {currentCheckpoint.prompt}
          </p>
        </div>
        <button
          onClick={handleRepeatPrompt}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 10px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            fontSize: '0.78rem'
          }}
        >
          <Volume2 size={15} /> Repeat
        </button>
      </div>

      {/* LEFT TAP ZONE */}
      <div
        className="tap-zone tap-zone-left"
        onClick={() => makeChoice('left')}
        role="button"
        aria-label={`Choose option A: ${leftChoice?.label}`}
      >
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid var(--emerald-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
            }}
          >
            <ArrowLeft size={32} color="var(--emerald-400)" />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
            TAP LEFT HALF
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.35rem', color: '#ffffff', lineHeight: 1.25 }}>
            {leftChoice?.label || 'Option Left'}
          </h3>
        </div>
      </div>

      {/* RIGHT TAP ZONE */}
      <div
        className="tap-zone tap-zone-right"
        onClick={() => makeChoice('right')}
        role="button"
        aria-label={`Choose option B: ${rightChoice?.label}`}
      >
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '2px solid var(--amber-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)'
            }}
          >
            <ArrowRight size={32} color="var(--amber-400)" />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--amber-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
            TAP RIGHT HALF
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.35rem', color: '#ffffff', lineHeight: 1.25 }}>
            {rightChoice?.label || 'Option Right'}
          </h3>
        </div>
      </div>
    </div>
  );
}
