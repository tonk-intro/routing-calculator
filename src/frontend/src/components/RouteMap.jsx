import {
  MapContainer,
  Tooltip,
  TileLayer,
  Marker,
  Polygon,
} from "react-leaflet";

import { memo } from "react";

import stationCodeToLatLong from "../helper/converter";

import "leaflet/dist/leaflet.css";

const RouteMap = memo(function RouteMap({ data, from, to }) {
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

  const coords = {
    latWest:
      paths
        .map((p) => p.path)
        .map((p) => p[0][0])
        .sort((a, b) => a - b)[0] + 0.5,

    latEast:
      paths
        .map((p) => p.path)
        .map((p) => p[0][0])
        .sort((a, b) => b - a)[0] - 0.5,
    longNorth:
      paths
        .map((p) => p.path)
        .map((p) => p[0][1])
        .sort((a, b) => a - b)[0] - 0.5,

    longSouth:
      paths
        .map((p) => p.path)
        .map((p) => p[0][1])
        .sort((a, b) => b - a)[0] + 0.5,
  };

  console.table(coords);

  const fromStation = stationCodeToLatLong(from.id);
  const toStation = stationCodeToLatLong(to.id);

  return (
    <div id="map">
      <MapContainer
        style={{ width: "50%", height: "400px" }}
        // center={[center.lat, center.long]}
        // zoom={7}
        bounds={[
          [coords.latWest, coords.longNorth],
          [coords.latEast, coords.longSouth],
        ]}
        // scrollWheelZoom={center.zoom}
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
});

export default RouteMap;
