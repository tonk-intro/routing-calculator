export default function stationCodeToLatLong(stationList, stationCode) {
  console.log(stationList);
  const station = stationList.find((item) => item.id == stationCode);
  return { lat: station.lat, long: station.long, name: station.name };
}
