require("dotenv").config({ path: ".env" });

const { getMap, fuseMaps, routeToMapList } = require("../db/maps");
const { routeToMaps } = require("../logic/route_map");

async function test() {
  //   await getMap("AA");
  //   const ce = await getMap("CE");
  //   const we = await getMap("WE");

  //   console.log(fuseMaps(ce, we));

  const result = await routeToMaps("AAP", "CAR");
  console.log(result);
}

test();
