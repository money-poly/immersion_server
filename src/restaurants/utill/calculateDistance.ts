export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const phi1 = (lat1 * Math.PI) / 180; // 위도1 (라디안)
  const phi2 = (lat2 * Math.PI) / 180; // 위도2 (라디안)
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180; // 위도 차이 (라디안)
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180; // 경도 차이 (라디안)

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
