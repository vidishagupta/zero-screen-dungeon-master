import React, { useState, useEffect } from 'react';
import { Navigation, Play, Pause, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';

export function GPSDebugSimulator({ isSimulating, setIsSimulating, simulateStep, totalDistance }) {
  const [isOpen, setIsOpen] = useState(false);
  const [autoWalk, setAutoWalk] = useState(false);
  const [stepMeters, setStepMeters] = useState(20);

  useEffect(() => {
    if (!autoWalk) return;
    const interval = setInterval(() => {
      simulateStep(4); // simulate 4 meters every 1.5 seconds (~2.6 m/s)
    }, 1500);
    return () => clearInterval(interval);
  }, [autoWalk, simulateStep]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.25rem',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={14} color="var(--amber-400)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--amber-400)', letterSpacing: '0.04em' }}>
            GPS TEST SIMULATOR {isSimulating ? '(ACTIVE)' : ''}
          </span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
            Dist: {Math.round(totalDistance)}m
          </span>
        </div>
        <div>
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>

      {/* Expanded Controls */}
      {isOpen && (
        <div className="animate-fade-in" style={{ padding: '0 1.25rem 1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <button
              onClick={() => {
                const next = !isSimulating;
                setIsSimulating(next);
                if (!next) setAutoWalk(false);
              }}
              style={{
                background: isSimulating ? 'var(--amber-500)' : 'rgba(255,255,255,0.08)',
                color: isSimulating ? '#090d16' : 'var(--slate-200)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {isSimulating ? 'Simulator Mode ON' : 'Enable Simulator'}
            </button>

            <button
              onClick={() => {
                setIsSimulating(true);
                setAutoWalk(!autoWalk);
              }}
              style={{
                background: autoWalk ? 'var(--emerald-500)' : 'rgba(255,255,255,0.08)',
                color: autoWalk ? '#090d16' : 'var(--slate-200)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {autoWalk ? <Pause size={13} /> : <Play size={13} />}
              {autoWalk ? 'Auto-Walking...' : 'Start Auto-Walk'}
            </button>
          </div>

          {/* Quick step buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                setIsSimulating(true);
                simulateStep(20);
              }}
              style={{
                flex: 1,
                padding: '8px',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              +20m
            </button>
            <button
              onClick={() => {
                setIsSimulating(true);
                simulateStep(50);
              }}
              style={{
                flex: 1,
                padding: '8px',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              +50m
            </button>
            <button
              onClick={() => {
                setIsSimulating(true);
                simulateStep(80);
              }}
              style={{
                flex: 1,
                padding: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid var(--emerald-500)',
                color: 'var(--emerald-400)',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              +80m (1 Checkpoint)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
