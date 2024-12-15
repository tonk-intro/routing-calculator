import { getRoutingPoints } from "../db/routing.js";
import { getFare } from "./../db/fares.js";
import {
  convertStationToGroup,
  convertGroupToStations,
} from "../db/routing.js";

import type { Path } from "./dijkstra.js";

type ShortestPathFunc = (from: string, to: string) => Path;

async function getCommonRoutingPoint(
  from: string,
  to: string,
  shortestPath: ShortestPathFunc
) {
  const rpFrom = await getRoutingPoints(from);
  const rpTo = await getRoutingPoints(to);

  const shared = rpFrom.filter((rp) => rpTo.some((item) => item == rp));

  if (shared.length == 0) {
    return null;
  } else if (shared.length == 1) {
    return shared[0];
  } else {
    // More than two  RPs -- now we need to determine shortest path between the stations
    // and return the routing point lying on iy.

    const route = await shortestPath(from, to);
    return shared.find((rp) => route.path.some((station) => station == rp));
  }
}

async function getValidRoutingPoints(from, to) {
  // We might need to exclude some routing points based on the fares in 1996

  let rpFrom = await getRoutingPoints(from);
  let rpTo = await getRoutingPoints(to);

  const validFrom = [];
  const validTo = [];

  let fare1, fare2;

  if (rpTo.length == 1) {
    validTo.push(rpTo[0]);
  } else {
    rpTo = await expandStationGroups(rpTo);

    for (const rp of rpTo) {
      try {
        fare1 = await getFare(from, rp);
        fare2 = await getFare(from, to);
      } catch (err) {
        console.log("ERROR: " + err);
        // No fare could be determined for one of the routes.
        // Based on the documentation it is not very clear to me what is supposed to happen.
        // For now: regard route as invalid

        continue;
      }

      if (fare1.fare - fare2.fare > 0) {
        // console.log(`${rp} not valid!`);
      } else {
        // console.log(`${rp} valid!`);
        validTo.push(rp);
      }
    }
  }

  if (rpFrom.length == 1) {
    validFrom.push(rpFrom[0]);
  } else {
    rpFrom = await expandStationGroups(rpFrom);

    for (const rp of rpFrom) {
      try {
        fare1 = await getFare(rp, to);
        fare2 = await getFare(from, to);
      } catch (err) {
        console.log("ERROR: " + err);
        // No fare could be determined for one of the routes.
        // Based on the documentation it is not very clear to me what is supposed to happen.
        // For now: regard route as invalid

        continue;
      }

      if (fare1.fare - fare2.fare > 0) {
        // console.log(`${rp} not valid!`);
      } else {
        // console.log(`${rp} valid!`);
        validFrom.push(rp);
      }
    }
  }

  return {
    from: await contractStationGroups(validFrom),
    to: await contractStationGroups(validTo),
  };
}

// takes an array of routing points and returns array where routing groups (e.g. G01)
// are replaced by all the group members
async function expandStationGroups(routingPoints: string[]) {
  const result: string[] = [];
  for (const rp of routingPoints) {
    const transformed = await convertGroupToStations(rp);
    transformed.forEach((item) => result.push(item));
  }

  return result;
}

// Takes array of touring points and collapses the stations that have routing groups into them
async function contractStationGroups(routingPoints: string[]) {
  const result: string[] = [];

  for (const rp of routingPoints) {
    const conv = await convertStationToGroup(rp);
    if (!result.includes(conv)) {
      result.push(conv);
    }
  }

  return result;
}

module.exports = { getCommonRoutingPoint, getValidRoutingPoints };
