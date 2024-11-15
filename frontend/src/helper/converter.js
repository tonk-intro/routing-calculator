export default function stationCodeToLatLong(stationList, stationCode) {
  const station = stationList.find((item) => item.id == stationCode);
  return { lat: station.lat, long: station.long, name: station.name };
}
