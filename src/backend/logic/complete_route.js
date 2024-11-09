const { getNeighbours } = require("../db/distances");
const { createRailwayGraph } = require("./graph");
const { shortestPath } = require("./dijkstra");
const { getAllStationIds, getStationByName } = require("../db/stations");
const { getCommonRoutingPoint } = require("./routing_points");
const { getRoutingPoints } = require("../db/routing");
const { getPermittedRoutes } = require("./route_map");

let shortestPathFunc = null;

async function setup() {
  const allTheStations = await getAllStationIds();
  const stationsGraph = await createRailwayGraph(allTheStations, getNeighbours);

  shortestPathFunc = (from, to) => shortestPath(stationsGraph, from, to);
}
// Input names of target and destination station
async function getRouteWithAllDetails(from, to) {
  const result = { haveSharedRP: false, error: false };

  if (from == to) {
    result.error = true;
    return result;
  }

  const fromStation = await getStationByName(from);
  const toStation = await getStationByName(to);

  result.fromStation = fromStation;
  result.toStation = toStation;

  if (!shortestPathFunc) throw new Error("call setup first!");

  const shared = await getCommonRoutingPoint(
    fromStation.id,
    toStation.id,
    shortestPathFunc
  );

  if (shared != null) {
    result.haveSharedRP = true;
    result.sharedRP = shared;

    return result;
  }

  // No common RPs!

  let fromRPs, toRPs;

  try {
    fromRPs = await getRoutingPoints(fromStation.id);
    toRPs = await getRoutingPoints(toStation.id);
  } catch (err) {
    result.error = true;
    result.errorMessage = {
      text: `Couldn't resolve RPS from ${fromStation.name} to ${toStation.name}`,
      object: err,
    };
    return result;
  }

  result.routingPoints = { from: fromRPs, to: toRPs };

  result.maps = [];
  result.londonMaps = { used: false, from: [], to: [] };

  for (rp1 of fromRPs) {
    for (rp2 of toRPs) {
      const maps = await getPermittedRoutes(rp1, rp2);
      for (m of maps.regular) {
        result.maps.push({ map: m, route: `${rp1} to ${rp2}` });
      }
      for (m of maps.london.to) {
        result.londonMaps.to.push({
          map: m,
          route: `${rp1} to ${rp2} VIA LONDON`,
        });
      }
      for (m of maps.london.from) {
        result.londonMaps.from.push({
          map: m,
          route: `${rp1} to ${rp2} VIA LONDON`,
        });
      }
    }
  }

  return result;
}

module.exports = { getRouteWithAllDetails, setup };
