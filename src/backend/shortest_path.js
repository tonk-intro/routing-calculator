require("dotenv").config({ path: "../../.env" });

const {
  getStationForId,
  getIdForStation,
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

// getStationForId("CBG");
// getIdForStation("Cambridge");

// getAllStationIds().then((res) => console.log(res));

// getNeighbours("CBG").then((res) => console.log(res));
// getDistance("CBG", "FXN").then((res) => console.log(res));
