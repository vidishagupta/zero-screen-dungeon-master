import React from 'react';
import { Volume2, VolumeX, ShieldCheck, BatteryCharging, Sparkles, Sliders } from 'lucide-react';
import { useAudioEngine } from '../context/AudioEngineContext';
import { useGame } from '../context/GameContext';

export function Header({ isWakeLocked, onOpenSettings }) {
  const { isSpeaking, isPaused } = useAudioEngine();
  const { gamePhase } = useGame();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1.25rem',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--emerald-500), var(--cyan-500))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
        }}>
          <Sparkles size={18} color="#090d16" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.1 }}>ZSDM</h1>
          <p style={{ fontSize: '0.68rem', color: 'var(--slate-400)', letterSpacing: '0.04em' }}>
            ZERO-SCREEN AUDIO RPG
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isWakeLocked && (
          <div
            title="Screen Wake Lock Active (Walk will not sleep)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--emerald-400)',
              fontSize: '0.72rem',
              fontWeight: 600
            }}
          >
            <ShieldCheck size={13} />
            <span>Wake Lock</span>
          </div>
        )}

        {/* Audio Engine Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '999px',
            background: isSpeaking ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isSpeaking ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-subtle)'}`,
            color: isSpeaking ? 'var(--cyan-500)' : 'var(--slate-400)',
            fontSize: '0.72rem',
            fontWeight: 600
          }}
        >
          <Volume2 size={13} />
          <span>{isSpeaking ? 'Narrating' : 'TTS Ready'}</span>
        </div>

        {/* Voice / Audio Settings Button */}
        <button
          onClick={onOpenSettings}
          aria-label="Audio & Voice Settings"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px',
            color: 'var(--slate-300)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sliders size={16} />
        </button>
      </div>
    </header>
  );
}
