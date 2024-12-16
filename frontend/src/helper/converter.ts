import type { Station } from "@backend/shared";

interface StationWithCoordinates {
  lat: number;
  long: number;
  name: string;
}

export default function stationCodeToLatLong(
  stationList: Station[],
  stationCode: string
): StationWithCoordinates {
  const station = stationList.find((item) => item.id == stationCode);
  if (!station) throw new Error("Didn't find station for " + stationCode);

  return { lat: +station.lat!, long: +station.long!, name: station.name };
}
