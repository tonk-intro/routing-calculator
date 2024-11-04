const { getRoutingPoints, groupToStation } = require("../db/routing");
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

  const validFrom = [];
  const validTo = [];

  for (rp of rpTo) {
    const fare1 = await getFare(from, rp);
    const fare2 = await getFare(from, to);

    if (fare1 - fare2 > 0) {
      console.log(`${rp} not valid!`);
    } else {
      console.log(`${rp} valid!`);
      validTo.push(rp);
    }
  }

  for (rp of rpFrom) {
    const fare1 = await getFare(rp, to);
    const fare2 = await getFare(from, to);

    if (fare1 - fare2 > 0) {
      console.log(`${rp} not valid!`);
    } else {
      console.log(`${rp} valid!`);
      validFrom.push(rp);
    }
  }

  return { from: validFrom, to: validTo };
}

module.exports = { getCommonRoutingPoint, getValidRoutingPoints };
