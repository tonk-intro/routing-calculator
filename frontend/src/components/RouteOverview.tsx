import MapContainer from "./MapContainer";

import type { Station, PermittedRouteOverview } from "@backend/shared";

import ErrorView, { type ErrorInfo } from "./ErrorView";

interface Props {
  stationList: Station[] | null;
  route: PermittedRouteOverview | null;
  error?: ErrorInfo;
}

export default function RouteOverview({ error, stationList, route }: Props) {
  if (error) return <ErrorView error={error} />;

  if (!route) return <p>Loading ...</p>;

  if (!stationList) return null;

  if (route.haveSharedRP) return SharedRoutingPoints(route);
  return DistinctRoutingPoints(stationList, route);
}

function SharedRoutingPoints(route: PermittedRouteOverview) {
  return (
    <div>
      <h2>
        {route && route.fromStation.name} to {route && route.toStation.name}
      </h2>

      <p>
        {route.fromStation.name} and {route.toStation.name} have the following
        Routing Point in Common: {route.sharedRP.name} ({route.sharedRP.id}).
      </p>
    </div>
  );
}

function DistinctRoutingPoints(
  stationList: Station[],
  route: PermittedRouteOverview
) {
  return (
    <>
      <div>
        <h2>
          {route.fromStation.name} to {route.toStation.name}
        </h2>

        <p>
          {route.fromStation.name} is associated with the following routing
          points:
        </p>

        <ul>
          {route.routingPoints.from.map((item, index) => (
            <li key={index}>
              {item.name} ({item.id})
            </li>
          ))}
        </ul>
        <p>
          {route.toStation.name} is associated with the following routing
          points:
        </p>
        <ul>
          {route.routingPoints.to.map((item, index) => (
            <li key={index}>
              {item.name} ({item.id})
            </li>
          ))}
        </ul>
      </div>
      <MapContainer
        stationList={stationList}
        maps={route.maps.regular}
      ></MapContainer>

      <div className="side-by-side">
        <MapContainer stationList={stationList} maps={route.maps.london.to}>
          <h2>{route.fromStation.name} to London</h2>
        </MapContainer>

        <MapContainer stationList={stationList} maps={route.maps.london.from}>
          <h2>London to {route.toStation.name}</h2>
        </MapContainer>
      </div>
    </>
  );
}

// function filterMap(map, term, stationList) {
//   if (term == "") return map;

//   const stationId = stationList.find((st) => st.name == term);
//   if (!stationId) return map;

//   return map.filter(m => )
// }
