export type Coordinates = {
  lat: number;
  lng: number;
};

export const calculateDistance = (
  coords1: Coordinates,
  coords2: Coordinates,
) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (distance?: number) => {
  if (!distance) return "";
  if (distance < 1) return `${Math.round(distance * 1000)}m away`;
  return `${distance.toFixed(1)}km away`;
};
