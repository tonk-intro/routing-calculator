const { getRoutingPoints } = require("../db/routing");
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

  const rpFrom = await getRoutingPoints(from);
  const rpTo = await getRoutingPoints(to);

  for (rp of rpTo) {
    const fare1 = await getFare(from, rp);
    const fare2 = await getFare(from, to);

    if (fare1 - fare2 < 0) {
      console.log(`${rp} not valid!`);
    } else {
      console.log(`${rp} valid!`);
    }
  }
}

module.exports = { getCommonRoutingPoint, getValidRoutingPoints };
