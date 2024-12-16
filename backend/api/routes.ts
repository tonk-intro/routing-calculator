import { getNeighbours } from "../db/distances.js";
import { createRailwayGraph } from "../logic/graph.js";
import type { ShortestPathFunc } from "../logic/routing_points.js";

import type { PermittedRouteMaps, MapContainer } from "../logic/route_map.ts";

import { shortestPath } from "../logic/dijkstra.js";
import {
  getAllStationIds,
  getStationByName,
  getStationOrGroupNameById,
} from "../db/stations.js";
import {
  getCommonRoutingPoint,
  getValidRoutingPoints,
} from "../logic/routing_points.js";
import { getPermittedRoutes } from "../logic/route_map.js";
import { convertGroupToMainStation } from "../db/routing.js";

let shortestPathFunc: ShortestPathFunc;

export async function setup() {
  const allTheStations = await getAllStationIds();
  const stationsGraph = await createRailwayGraph(allTheStations, getNeighbours);
  shortestPathFunc = (from, to) => shortestPath(stationsGraph, from, to);
}

import type { Station } from "../db/stations.js";

interface PermittedRouteOverview {
  error: boolean;
  fromStation?: string;
  toStation?: string;
  haveSharedRP?: boolean;
  sharedRP: Station;
  routingPoints: { from: Station[]; to: Station[] };
  maps: PermittedRouteMaps<MapContainerRouting>;
}

interface MapContainerRouting extends MapContainer {
  toRP: string;
  fromRP: string;
}

// Input names of target and destination station
export async function getRouteWithAllDetails(
  from: string,
  to: string
): Promise<PermittedRouteOverview> {
  if (!shortestPathFunc) throw new Error("call setup first!");

  const result: PermittedRouteOverview = {
    haveSharedRP: false,
    error: false,
    maps: { regular: [], london: { from: [], to: [] } },
    routingPoints: { from: [], to: [] },
    sharedRP: { id: "", name: "" },
  };

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

  for (const rp1 of fromRPs) {
    for (const rp2 of toRPs) {
      const maps = await getPermittedRoutes(rp1, rp2);
      for (const m of maps.regular) {
        if (!result.maps.regular.some((item) => item.title == m.title)) {
          result.maps.regular.push({
            title: m.title,
            map: m.map,
            from: await convertGroupToMainStation(rp1),
            to: await convertGroupToMainStation(rp2),
            fromRP: rp1,
            toRP: rp2,
          });
        }
      }
      for (const m of maps.london.to) {
        if (!result.maps.london.to.some((item) => item.title == m.title)) {
          result.maps.london.to.push({
            title: m.title,
            map: m.map,
            from: await convertGroupToMainStation(rp1),
            to: "EUS",
            fromRP: rp1,
            toRP: "G01",
          });
        }
      }
      for (const m of maps.london.from) {
        if (!result.maps.london.from.some((item) => item.title == m.title)) {
          result.maps.london.from.push({
            title: m.title,
            map: m.map,
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
