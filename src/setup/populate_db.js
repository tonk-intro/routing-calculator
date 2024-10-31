require("dotenv").config({ path: "../../.env" });

const pool = require("./db_pool");

const populateStations = require("./tables/stations");

const PREFIX = "../../private/routing_data/";
const stationsFile = PREFIX + "RJRG0831.RGS";

populateStations(stationsFile, pool);
