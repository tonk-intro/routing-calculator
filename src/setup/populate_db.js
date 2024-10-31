require("dotenv").config({ path: "../../.env" });

const pool = require("../db_pool");
const populateDistances = require("./tables/distances");

const populateStations = require("./tables/stations");

const PREFIX = "../../private/routing_data/";
const stationsFile = PREFIX + "RJRG0831.RGS";
const distancesFile = PREFIX + "RJRG0831.RGD";

populateStations(stationsFile, pool);
populateDistances(distancesFile, pool);
