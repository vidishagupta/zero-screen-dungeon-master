/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in meters.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Filter GPS noise & unrealistic jumps.
 * Rejects readings with accuracy > 35m or implied speed > 6.0 m/s (~21.6 km/h) for walking.
 */
export function isRealisticMovement(prevCoord, newCoord) {
  if (!prevCoord) return true;
  if (newCoord.accuracy && newCoord.accuracy > 35) {
    return false; // Low precision reading
  }

  const dist = calculateHaversineDistance(
    prevCoord.latitude,
    prevCoord.longitude,
    newCoord.latitude,
    newCoord.longitude
  );

  // Time delta in seconds
  const dt = (newCoord.timestamp - prevCoord.timestamp) / 1000;
  if (dt <= 0) return false;

  const speed = dist / dt; // meters per second
  // Max walking/jogging speed threshold: 6.0 m/s
  return speed <= 6.0;
}
