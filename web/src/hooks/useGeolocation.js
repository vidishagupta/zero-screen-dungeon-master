import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateHaversineDistance, isRealisticMovement } from '../utils/haversine';

export function useGeolocation({ enabled = false, onDistanceUpdate } = {}) {
  const [coords, setCoords] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0); // in meters
  const [accuracy, setAccuracy] = useState(null);
  const [speed, setSpeed] = useState(null); // m/s
  const [error, setError] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle | locating | active | error

  const lastValidCoordRef = useRef(null);
  const watchIdRef = useRef(null);

  const handlePosition = useCallback((position) => {
    const { latitude, longitude, accuracy: acc, speed: spd } = position.coords;
    const timestamp = position.timestamp || Date.now();
    const newCoord = { latitude, longitude, accuracy: acc, timestamp };

    setAccuracy(acc);
    if (spd !== null && !isNaN(spd)) {
      setSpeed(Math.max(0, spd));
    }
    setGpsStatus('active');
    setError(null);

    // Initial reading
    if (!lastValidCoordRef.current) {
      lastValidCoordRef.current = newCoord;
      setCoords(newCoord);
      return;
    }

    // Filter noisy updates
    if (isRealisticMovement(lastValidCoordRef.current, newCoord)) {
      const stepDist = calculateHaversineDistance(
        lastValidCoordRef.current.latitude,
        lastValidCoordRef.current.longitude,
        newCoord.latitude,
        newCoord.longitude
      );

      // Only accumulate if moved >= 1.5m to avoid micro-jitter
      if (stepDist >= 1.5) {
        setTotalDistance((prev) => {
          const next = prev + stepDist;
          if (onDistanceUpdate) onDistanceUpdate(next, stepDist);
          return next;
        });
        lastValidCoordRef.current = newCoord;
        setCoords(newCoord);
      }
    }
  }, [onDistanceUpdate]);

  const handleError = useCallback((err) => {
    console.warn('Geolocation watch error:', err.message);
    setError(err.message);
    setGpsStatus('error');
  }, []);

  // Real GPS watch
  useEffect(() => {
    if (!enabled || isSimulating) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setGpsStatus('error');
      return;
    }

    setGpsStatus('locating');

    const options = {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 10000
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      options
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, isSimulating, handlePosition, handleError]);

  // Manual simulator step
  const simulateStep = useCallback((meters) => {
    setTotalDistance((prev) => {
      const next = prev + meters;
      if (onDistanceUpdate) onDistanceUpdate(next, meters);
      return next;
    });
    setSpeed(1.3); // ~1.3 m/s walking speed
  }, [onDistanceUpdate]);

  const resetDistance = useCallback(() => {
    setTotalDistance(0);
    lastValidCoordRef.current = null;
  }, []);

  return {
    coords,
    totalDistance,
    accuracy,
    speed,
    error,
    gpsStatus,
    isSimulating,
    setIsSimulating,
    simulateStep,
    resetDistance
  };
}
