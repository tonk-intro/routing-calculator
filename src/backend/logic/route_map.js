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

  //   const outgoing = getOutgoingPaths(allMaps[0].map, "CBG");

  //   console.log(outgoing);

  //   const paths = filterOutIrrelevantRoutes(allMaps[0].map, "CBG", "NRW");

  //   const result = allMaps.map((map) => filterOutIrrelevantRoutes(map, from, to));

  return allMaps.map((map) => {
    return {
      //   map: map.map,
      map: filterOutIrrelevantRoutes(map.map, from, to),

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

function filterOutIrrelevantRoutes(map, from, to) {
  const routes = [];

  findRoutes(map, from, to, [], routes);

  const usedStations = routes.reduce((prev, cur) => {
    const result = [];
    for (item of cur) {
      if (!prev.includes(item)) prev.push(item);
    }
    return prev;
  }, []);

  const filteredMap = {};

  for (node in map) {
    if (usedStations.includes(node)) {
      filteredMap[node] = { name: node, neighbours: [] };
      for (nb of map[node].neighbours) {
        if (usedStations.includes(nb.station)) {
          filteredMap[node].neighbours.push({
            station: nb.station,
            colour: nb.colour,
          });
        }
      }
    }
  }

  return filteredMap;
}

function findRoutes(map, current, dest, path, allPaths) {
  path.push(current);

  if (current == dest) {
    allPaths.push([...path, current]);
  } else {
    const lookedAtNbs = [];
    for (nb of map[current].neighbours) {
      console.log(`Calling findRoutes for ${nb.station} from ${current}`);
      if (!path.includes(nb.station))
        findRoutes(map, nb.station, dest, path, allPaths);
      lookedAtNbs.push(nb.station);
    }
  }
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
