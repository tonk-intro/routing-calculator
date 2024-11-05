import stationData from "./data/stations.json";

export default function stationCodeToLatLong(code) {
  const station = stationData.find((item) => item.crsCode == code);
  return { lat: station.lat, long: station.long, name: station.stationName };
}
