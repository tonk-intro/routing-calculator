require("dotenv").config({ path: "../../.env" });

const pool = require("../db_pool");
const { populateCodeMap } = require("./tables/codemap");
const populateDistances = require("./tables/distances");
const { populateFares } = require("./tables/fares");

const populateStations = require("./tables/stations");

const { populateStationGroups } = require("./tables/groups");

const { populateRoutes } = require("./tables/routes");
const { populateMaps } = require("./tables/maps");

const PREFIX = "../../private/routing_data/";
const stationsFile = PREFIX + "RJRG0831.RGS";
const distancesFile = PREFIX + "RJRG0831.RGD";
const codeMapFile = PREFIX + "RJRG0831.RGY";
const faresFile = PREFIX + "nfm64";
const groupFile = PREFIX + "RJRG0831.RGG";
const routeFile = PREFIX + "RJRG0831.RGR";
const mapFile = PREFIX + "RJRG0831.RGL";

// populateFares(faresFile, pool); // It's a monster!!
// populateStations(stationsFile, pool);
// populateDistances(distancesFile, pool);
// populateCodeMap(codeMapFile, pool);
// populateStationGroups(groupFile, pool);

// populateRoutes(routeFile, pool);
populateMaps(mapFile, pool);
