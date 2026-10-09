import React, { useState, useEffect } from 'react';
import { Eye, Smartphone } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function PocketModeOverlay() {
  const { isPocketMode, setIsPocketMode, metersRemaining, selectedStory } = useGame();
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 1200);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  if (!isPocketMode) return null;

  const handleScreenTap = () => {
    const next = tapCount + 1;
    if (next >= 2) {
      setIsPocketMode(false);
      setTapCount(0);
    } else {
      setTapCount(next);
    }
  };

  return (
    <div
      className="pocket-mode-overlay animate-fade-in"
      onClick={handleScreenTap}
      role="button"
      tabIndex={0}
      aria-label="Pocket Mode Active. Tap screen twice to exit."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
        <Smartphone size={16} />
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>POCKET MODE ACTIVE</span>
      </div>

      {/* Subtle glowing center indicator */}
      <div style={{ textAlign: 'center' }}>
        <div className="pocket-glow" style={{ margin: '0 auto 1.5rem auto' }} />
        <p style={{ fontSize: '0.85rem', color: '#475569', letterSpacing: '0.05em' }}>
          Walking... ~{metersRemaining}m to next checkpoint
        </p>
      </div>

      {/* Exit instruction */}
      <div style={{ textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {tapCount === 1 ? '👉 Tap ONE MORE TIME to wake HUD' : 'Double tap anywhere to wake screen'}
        </p>
      </div>
    </div>
  );
}
