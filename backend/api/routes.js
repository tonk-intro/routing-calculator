const { getNeighbours } = require("../db/distances");
const { createRailwayGraph } = require("../logic/graph");
const { shortestPath } = require("../logic/dijkstra");
const {
  getAllStationIds,
  getStationByName,
  getStationOrGroupNameById,
} = require("../db/stations");
const { getCommonRoutingPoint } = require("../logic/routing_points");
const { getValidRoutingPoints } = require("../logic/routing_points");
const { getPermittedRoutes } = require("../logic/route_map");
const { convertGroupToMainStation } = require("../db/routing");

let shortestPathFunc = null;

async function setup() {
  const allTheStations = await getAllStationIds();
  const stationsGraph = await createRailwayGraph(allTheStations, getNeighbours);
  shortestPathFunc = (from, to) => shortestPath(stationsGraph, from, to);
}
// Input names of target and destination station
async function getRouteWithAllDetails(from, to) {
  if (!shortestPathFunc) throw new Error("call setup first!");

  const result = { haveSharedRP: false, error: false };

  if (from == to) {
    throw new Error("Origin and destination are identical: " + from + ".");
  }

  const fromStation = await getStationByName(from);
  const toStation = await getStationByName(to);

  result.fromStation = fromStation;
  result.toStation = toStation;

  const shared = await getCommonRoutingPoint(
    fromStation.id,
    toStation.id,
    shortestPathFunc
  );

  if (shared != null) {
    result.haveSharedRP = true;
    result.sharedRP = await getStationOrGroupNameById(shared);

    return result;
  }

  // No common RPs!

  const validRPs = await getValidRoutingPoints(fromStation.id, toStation.id);

  const fromRPs = validRPs.from;
  const toRPs = validRPs.to;

  result.routingPoints = {
    from: await Promise.all(
      fromRPs.map(async (rp) => await getStationOrGroupNameById(rp))
    ),
    to: await Promise.all(
      toRPs.map(async (rp) => await getStationOrGroupNameById(rp))
    ),
  };

  result.maps = [];
  result.londonMaps = { from: [], to: [] };

  for (rp1 of fromRPs) {
    for (rp2 of toRPs) {
      const maps = await getPermittedRoutes(rp1, rp2);
      for (m of maps.regular) {
        if (!result.maps.some((item) => item.map.title == m.title)) {
          result.maps.push({
            map: m,
            from: await convertGroupToMainStation(rp1),
            to: await convertGroupToMainStation(rp2),
            fromRP: rp1,
            toRP: rp2,
          });
        }
      }
      for (m of maps.london.to) {
        if (!result.londonMaps.to.some((item) => item.map.title == m.title)) {
          result.londonMaps.to.push({
            map: m,
            from: await convertGroupToMainStation(rp1),
            to: "EUS",
            fromRP: rp1,
            toRP: "G01",
          });
        }
      }
      for (m of maps.london.from) {
        if (!result.londonMaps.from.some((item) => item.map.title == m.title)) {
          result.londonMaps.from.push({
            map: m,
            from: "EUS",
            to: await convertGroupToMainStation(rp2),
            fromRP: "G01",
            toRP: rp2,
          });
        }
      }
    }
  }

  return result;
}

module.exports = { getRouteWithAllDetails, setup };
