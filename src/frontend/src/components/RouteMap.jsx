import {
  MapContainer,
  Tooltip,
  TileLayer,
  Marker,
  Polygon,
} from "react-leaflet";

import stationCodeToLatLong from "../helper/converter";

import "leaflet/dist/leaflet.css";

export function RouteMap({ data, from, to }) {
  const displayStations = [];
  const paths = [];

  for (const stat in data) {
    const stationConv = stationCodeToLatLong(stat);

    displayStations.push(stationConv);

    for (const nb of data[stat].neighbours) {
      const neighbourConv = stationCodeToLatLong(nb.station);

      paths.push({
        path: [
          [stationConv.lat, stationConv.long],
          [neighbourConv.lat, neighbourConv.long],
        ],
        colour: nb.colour,
      });
    }
  }

  const fromStation = stationCodeToLatLong(from.id);
  const toStation = stationCodeToLatLong(to.id);

  return (
    <div id="map">
      <MapContainer
        style={{ width: "50%", height: "400px" }}
        center={[54.251186, -4.463196]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayStations.map((item) => (
          <Marker opacity={0} position={[item.lat, item.long]}>
            <Tooltip direction="right" offset={[0, 20]} opacity={1}>
              {item.name}
            </Tooltip>
          </Marker>
        ))}
        <Marker position={[fromStation.lat, fromStation.long]}>
          <Tooltip direction="right" offset={[0, 20]} opacity={1}>
            {fromStation.name}
          </Tooltip>
        </Marker>
        <Marker position={[toStation.lat, toStation.long]}>
          <Tooltip direction="right" offset={[0, 20]} opacity={1}>
            {toStation.name}
          </Tooltip>
        </Marker>

        {paths.map((item) => (
          <Polygon pathOptions={{ color: item.colour }} positions={item.path} />
        ))}
      </MapContainer>
    </div>
  );
}
