import { useState, useEffect, useRef, useCallback } from 'react';

export function useScreenTime({ isActive = false, isPocketMode = false } = {}) {
  const [totalWalkSeconds, setTotalWalkSeconds] = useState(0);
  const [screenOnSeconds, setScreenOnSeconds] = useState(0);
  const [pocketSeconds, setPocketSeconds] = useState(0);

  const isVisibleRef = useRef(typeof document !== 'undefined' ? document.visibilityState === 'visible' : true);
  const isPocketRef = useRef(isPocketMode);

  useEffect(() => {
    isPocketRef.current = isPocketMode;
  }, [isPocketMode]);

  useEffect(() => {
    const handleVis = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTotalWalkSeconds((t) => t + 1);

      // If pocket mode is active OR screen is backgrounded, it counts as zero-screen / pocket time!
      const isScreenActive = isVisibleRef.current && !isPocketRef.current;
      if (isScreenActive) {
        setScreenOnSeconds((s) => s + 1);
      } else {
        setPocketSeconds((p) => p + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setTotalWalkSeconds(0);
    setScreenOnSeconds(0);
    setPocketSeconds(0);
  }, []);

  // Touch Grass Score: % of time walking without looking at screen
  const touchGrassScore = totalWalkSeconds > 0
    ? Math.min(100, Math.max(0, Math.round((pocketSeconds / totalWalkSeconds) * 100)))
    : 100;

  return {
    totalWalkSeconds,
    screenOnSeconds,
    pocketSeconds,
    touchGrassScore,
    resetTimer
  };
}
