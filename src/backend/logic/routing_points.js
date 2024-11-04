const { getRoutingPoints, expandStationGroups } = require("../db/routing");
const { getFare } = require("./../db/fares");

async function getCommonRoutingPoint(from, to, shortestPath) {
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

  if (rpFrom.length + rpTo.length == 2) return { from: rpFrom, to: rpTo };

  rpFrom = await expandStationGroups(rpFrom);
  rpTo = await expandStationGroups(rpTo);

  const validFrom = [];
  const validTo = [];

  let fare1, fare2;

  for (rp of rpTo) {
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

  for (rp of rpFrom) {
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

  return { from: validFrom, to: validTo };
}

module.exports = { getCommonRoutingPoint, getValidRoutingPoints };
