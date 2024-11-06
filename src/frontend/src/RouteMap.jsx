import {
  MapContainer,
  Tooltip,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";

import stationCodeToLatLong from "./converter";

import "leaflet/dist/leaflet.css";

const redOptions = { color: "red" };

export function RouteMap({ data }) {
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
          <Marker position={[item.lat, item.long]}>
            <Tooltip direction="right" offset={[0, 20]} opacity={1}>
              {item.name}
            </Tooltip>
          </Marker>
        ))}
        {paths.map((item) => (
          <Polygon pathOptions={{ color: item.colour }} positions={item.path} />
        ))}
      </MapContainer>
    </div>
  );
}
