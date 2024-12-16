import type { Station } from "@backend/shared";

export default function stationCodeToLatLong(
  stationList: Station[],
  stationCode: string
) {
  const station = stationList.find((item) => item.id == stationCode);
  if (!station) throw new Error("Didn't find station for " + stationCode);

  return { lat: station.lat, long: station.long, name: station.name };
}
