import { useCallback } from 'react';

export function useHaptics() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const triggerPattern = useCallback((pattern) => {
    if (isSupported) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Haptic vibration failed:', e);
      }
    }
  }, [isSupported]);

  return {
    isSupported,
    // Short buzz on blind tap
    tapFeedback: () => triggerPattern(50),
    // Double pulse when entering decision point
    decisionAlert: () => triggerPattern([150, 80, 150]),
    // Rich pattern when reaching story checkpoint
    checkpointReached: () => triggerPattern([100, 50, 100, 50, 200]),
    // Long joyous pattern on victory ending
    endingFanfare: () => triggerPattern([200, 100, 200, 100, 400, 100, 600])
  };
}
