require("dotenv").config({ path: "../../.env" });

const pool = require("../db_pool");
const { populateCodeMap } = require("./tables/codemap");
const populateDistances = require("./tables/distances");
const { populateFares } = require("./tables/fares");

const populateStations = require("./tables/stations");

const PREFIX = "../../private/routing_data/";
const stationsFile = PREFIX + "RJRG0831.RGS";
const distancesFile = PREFIX + "RJRG0831.RGD";
const codeMapFile = PREFIX + "RJRG0831.RGY";
const faresFile = PREFIX + "nfm64";

// populateFares(faresFile, pool); // It's a monster!!
// populateStations(stationsFile, pool);
// populateDistances(distancesFile, pool);
// populateCodeMap(codeMapFile, pool);
