const { routeToMapList, getMap, fuseMaps } = require("../db/maps");

async function routeToMaps(from, to) {
  const result = [];

  const mapList = await routeToMapList(from, to);

  for (const mapCombination of mapList) {
    const maps = mapCombination.split(",");

    let currentMap = null;

    for (m of maps) {
      if (m == "LO") {
        // LONDON NOT IMPLEMENTED YET

        console.log("Skipping LO map.");
        continue;
      }

      if (!currentMap) {
        currentMap = await getMap(m);
      } else {
        currentMap = fuseMaps(currentMap, await getMap(m));
      }
    }

    result.push({ title: mapCombination, map: currentMap });
  }

  return result;
}

module.exports = { routeToMaps };
