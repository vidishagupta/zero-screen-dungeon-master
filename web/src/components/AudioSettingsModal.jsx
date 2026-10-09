import React from 'react';
import { X, Volume2, Mic, Zap } from 'lucide-react';
import { useAudioEngine } from '../context/AudioEngineContext';

export function AudioSettingsModal({ isOpen, onClose }) {
  const {
    voices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    speechRate,
    setSpeechRate,
    pitch,
    setPitch,
    speak
  } = useAudioEngine();

  if (!isOpen) return null;

  const testVoice = () => {
    speak('Welcome adventurer. Your real footsteps guide your journey. Phone in pocket, headphones on.', { priority: true });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '1.5rem',
          background: '#0f172a',
          border: '1px solid var(--border-subtle)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={20} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Narration Voice Settings</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--slate-400)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Voice Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--slate-400)', marginBottom: '0.5rem', fontWeight: 600 }}>
            NARRATOR VOICE ({voices.length} detected on device)
          </label>
          <select
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          >
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang}) {v.default ? '★ Default' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Speed Rate Slider */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-400)', marginBottom: '0.4rem', fontWeight: 600 }}>
            <span>NARRATION SPEED</span>
            <span className="mono" style={{ color: 'var(--emerald-400)' }}>{speechRate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--emerald-500)', cursor: 'pointer' }}
          />
        </div>

        {/* Pitch Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-400)', marginBottom: '0.4rem', fontWeight: 600 }}>
            <span>VOICE PITCH</span>
            <span className="mono" style={{ color: 'var(--cyan-500)' }}>{pitch.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.05"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--cyan-500)', cursor: 'pointer' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={testVoice} className="btn-secondary" style={{ flex: 1 }}>
            <Zap size={15} /> Test Voice
          </button>
          <button onClick={onClose} className="btn-primary" style={{ flex: 1 }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
