const { routeToMapList, getMap, fuseMaps } = require("../db/maps");
const { convertGroupToMainStation } = require("../db/routing");

function getColourPicker() {
  const colours = ["red", "blue", "green", "black", "purple", "orange"];
  let count = 0;
  return () => {
    console.log(colours[count++ % colours.length]);
    return colours[count++ % (colours.length - 1)];
  };
}

async function getPermittedRoutes(from, to) {
  const cp = getColourPicker();
  const allMaps = await routeToMaps(from, to, cp);

  return allMaps.map((map) => {
    return { map: map.map, title: map.title };
  });

  // Now we can forget about the station ids
  from = await convertGroupToMainStation(from);
  to = await convertGroupToMainStation(to);

  // Identify permitted routes here! Then fuse together.

  let combinedMap = null;
  for (m of allMaps) {
    if (!combinedMap) combinedMap = m;
    else combinedMap = fuseMaps(combinedMap, m);
  }

  return [{ title: `Routes from ${from} to ${to}`, map: combinedMap }];
}

function filterOutIrrelevantRoutes(map, from, to) {}

async function routeToMaps(from, to, colourPicker) {
  const result = [];

  const mapList = await routeToMapList(from, to);

  for (const mapCombination of mapList) {
    const maps = mapCombination.split(",");

    let currentMap = null;

    for (m of maps) {
      if (m == "LO") {
        // LONDON means we need to combine from => G01 => to

        const toLondonMaps = await routeToMaps(from, "G01", colourPicker);
        const fromLondonMaps = await routeToMaps("G01", to, colourPicker);

        toLondonMaps.forEach((toMap) =>
          fromLondonMaps.forEach((fromMap) => {
            const finalMap = fuseMaps(fromMap.map, toMap.map);
            result.push({
              title: fromMap.title + "," + toMap.title,
              map: finalMap,
            });
          })
        );
        continue;
      }

      if (!currentMap) {
        currentMap = await getMap(m, colourPicker());
      } else {
        currentMap = fuseMaps(currentMap, await getMap(m, colourPicker()));
      }
    }

    result.push({ title: mapCombination, map: currentMap });
  }

  return result;
}

module.exports = { routeToMaps, getPermittedRoutes };
