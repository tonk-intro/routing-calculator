import {
  MapContainer,
  Tooltip,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";

import { memo } from "react";

import stationCodeToLatLong from "../helper/converter";

import "leaflet/dist/leaflet.css";

function areEqual(prevProps, nextProps) {
  // console.log("CHECKING EQUALITY");
  if (
    prevProps.from.id == nextProps.from.id &&
    prevProps.to.id == nextProps.to.id
  ) {
    console.log(prevProps);
    return true;
  }

  return false;
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}

function MapEvents() {
  const map = useMapEvents({
    click: () => {
      map.scrollWheelZoom.enable();
    },
    mouseout: () => {
      // alert("Left");
      map.scrollWheelZoom.disable();
    },
  });

  return null;
}

const RouteMap = memo(function RouteMap({ data, from, to }) {
  console.log("RE-RENDERING");
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
    latWest: paths
      .map((p) => p.path)
      .map((p) => p[0][0])
      .sort((a, b) => a - b)[0],

    latEast: paths
      .map((p) => p.path)
      .map((p) => p[0][0])
      .sort((a, b) => b - a)[0],
    longSouth: paths
      .map((p) => p.path)
      .map((p) => p[0][1])
      .sort((a, b) => a - b)[0],

    longNorth: paths
      .map((p) => p.path)
      .map((p) => p[0][1])
      .sort((a, b) => b - a)[0],
  };

  if (coords.latWest == null) {
    // TODO: This shouldn't really happen, apparently we are getting an empty map?!
    throw new Error("It seems that the map was empty!?");
    // return null;
  }
  console.table(coords);

  const fromStation = stationCodeToLatLong(from.id);
  const toStation = stationCodeToLatLong(to.id);

  return (
    <div id="map">
      <MapContainer
        style={{ width: "600px", height: "400px" }}
        // center={[center.lat, center.long]}
        // zoom={7}

        boundsOptions={{ padding: [50, 50] }}
        bounds={[
          [coords.latWest, coords.longNorth],
          [coords.latEast, coords.longSouth],
        ]}
        scrollWheelZoom={false}
      >
        <MapEvents />
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
}, areEqual);

export default RouteMap;
