require("dotenv").config({ path: "../../.env" });

const {
  getStationById,
  getStationByName,
  getAllStationIds,
} = require("./db/stations");

const { getNeighbours, getDistance } = require("./db/distances");

const { createRailwayGraph } = require("./graph");

const { shortestPath } = require("./dijkstra");

getAllStationIds().then((res) => {
  createRailwayGraph(res, getNeighbours).then((res) => {
    // shortestPath(res, "CBG", "PBO");
    shortestPath(res, "CBG", "EDB").then((res) => {
      console.log(res);
    });
  });
});
