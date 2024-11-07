const { routeToMapList, getMap, fuseMaps } = require("../db/maps");
const { convertGroupToMainStation } = require("../db/routing");

function getColourPicker() {
  const colours = ["red", "blue", "green", "black", "purple", "orange"];
  let count = 0;
  return () => {
    return colours[count++ % (colours.length - 1)];
  };
}

async function getPermittedRoutes(from, to) {
  const cp = getColourPicker();
  const allMaps = await routeToMaps(from, to, cp);

  // Now we can forget about the station ids
  from = await convertGroupToMainStation(from);
  to = await convertGroupToMainStation(to);

  const outgoing = getOutgoingPaths(allMaps[0].map, "CBG");

  console.log(outgoing);

  //   const paths = filterOutIrrelevantRoutes(allMaps[0].map, "CBG", "NRW");

  //   const result = allMaps.map((map) => filterOutIrrelevantRoutes(map, from, to));

  return allMaps.map((map) => {
    return {
      map: map.map,
      //   map: filterOutIrrelevantRoutes(map.map, from, to),

      title: map.title,
    };
  });

  //  Fuse the maps together.

  //   let combinedMap = null;
  //   for (m of allMaps) {
  //     if (!combinedMap) combinedMap = m;
  //     else combinedMap = fuseMaps(combinedMap, m);
  //   }

  //   return [{ title: `Routes from ${from} to ${to}`, map: combinedMap }];
}

// Still not working too well ...
function filterOutIrrelevantRoutes(inputMap, from, to) {
  const map = getOutgoingPaths(inputMap, from);

  map[from].predecessors = [];

  const result = {};

  const queue = [to];

  while (queue.length > 0) {
    const current = queue.splice(0, 1);

    console.log(`Looking at ${current}`);
    const station = map[current];

    result[current] = { name: map[current].name, neighbours: [] };
    for (pred of station.predecessors) {
      result[current].neighbours.push({ station: pred, colour: "red" });
      queue.push(pred);
    }
  }

  return result;
}
function getOutgoingPaths(inputMap, from) {
  const map = structuredClone(inputMap);
  const visited = [];

  const queue = [from];

  while (queue.length > 0) {
    const current = queue.splice(0, 1);

    const station = map[current];

    for (nb of station.neighbours) {
      if (!visited.includes(nb.station)) {
        visited.push(nb.station);
        queue.push(nb.station);
        if (!map[nb.station].predecessors) {
          map[nb.station].predecessors = [current];
        } else {
          map[nb.station].predecessors.push(current);
        }
      }
    }
  }

  return map;
}

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
            console.log(toMap.title + "," + fromMap.title);

            result.push({
              title: toMap.title + "," + fromMap.title,
              map: finalMap,
            });
          })
        );
      }

      if (!currentMap) {
        currentMap = await getMap(m, colourPicker());
      } else {
        currentMap = fuseMaps(currentMap, await getMap(m, colourPicker()));
      }
    }
    if (mapCombination != "LO")
      result.push({ title: mapCombination, map: currentMap });
  }

  return result;
}

module.exports = { routeToMaps, getPermittedRoutes };
