require("dotenv").config({ path: ".env" });

const { getFare } = require("../db/fares");
const { getRoutingPoints, contractStationGroups } = require("../db/routing");
const { getStationByName, getStationOrGroupById } = require("../db/stations");
const {
  getCommonRoutingPoint,
  getValidRoutingPoints,
} = require("../logic/routing_points");
const { getStationById, getAllStationIds } = require("../db/stations");

const { getNeighbours, getDistance } = require("../db/distances");

const { createRailwayGraph } = require("../logic/graph");

const { shortestPath } = require("../logic/dijkstra");

async function test() {
  const allTheStations = await getAllStationIds();
  const stationsGraph = await createRailwayGraph(allTheStations, getNeighbours);

  const shortestPathFunc = (from, to) => shortestPath(stationsGraph, from, to);

  // await getCommonRoutingPoint("CBG", "MPL", shortestPathFunc);
  // await getCommonRoutingPoint("CBG", "FXN", shortestPathFunc);
  // await getCommonRoutingPoint("HSB", "CPU", shortestPathFunc);

  console.log(await getStationOrGroupById("G12"));

  const rps1 = await getValidRoutingPoints("CEY", "BKD");
  const rps2 = await getValidRoutingPoints("LEU", "BSS");

  console.log(await contractStationGroups(rps1.from));
  console.log(await contractStationGroups(rps1.to));

  // console.log(await getValidRoutingPoints("ASN", "ALM"));
  // console.log(await getValidRoutingPoints("BYA", "TRI"));
  // console.log(await getValidRoutingPoints("CBG", "LBG"));

  //   const fare = await getFare("CBG", "MPL");

  //   const st = await getStationByName("Morpeth");
  //   const rp = await getRoutingPoints(st.id);

  //   console.log(rp);

  //   console.log(fare);
}

test();
