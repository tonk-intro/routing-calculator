import MapContainer from "./MapContainer";

export default function RouteOverview({ stationList, route }) {
  if (!route) return null;
  if (route.error) return null;

  if (route.haveSharedRP) return SharedRoutingPoints(route);
  return DistinctRoutingPoints(stationList, route);
}

function SharedRoutingPoints(route) {
  return (
    <div>
      <h2>
        {route && route.fromStation.name} to {route && route.toStation.name}
      </h2>

      <p>
        {route.fromStation.name} and {route.toStation.name} have the following
        Routing Point in Common: {route.sharedRP}.
      </p>
    </div>
  );
}

function DistinctRoutingPoints(stationList, route) {
  return (
    <>
      <MapContainer stationList={stationList} maps={route && route.maps}>
        <h2>
          {route && route.fromStation.name} to {route && route.toStation.name}
        </h2>
      </MapContainer>

      <div className="side-by-side">
        <MapContainer
          stationList={stationList}
          maps={route && route.londonMaps.to}
        >
          <h2>{route && route.fromStation.name} to London</h2>
        </MapContainer>

        <MapContainer
          stationList={stationList}
          maps={route && route.londonMaps.from}
        >
          <h2>London to {route && route.toStation.name}</h2>
        </MapContainer>
      </div>
    </>
  );
}
