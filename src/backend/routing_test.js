require("dotenv").config({ path: "../../.env" });

const { getFare } = require("./db/fares");
const { getRoutingPoints } = require("./db/routing");
const { getStationByName } = require("./db/stations");

// getRoutingPoints("CBG").then((res) => console.log(res));

// getStationByName("Morpeth").then((name) => {
//   getRoutingPoints(name.id).then((res) => console.log(res));
// });

getFare("CBG", "MPL").then((res) => console.log(res));
