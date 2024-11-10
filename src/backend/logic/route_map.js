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

  allMaps.regular = allMaps.regular.map((m) => {
    return {
      title: m.title,
      map: filterOutIrrelevantRoutes(m.map, from, to),
    };
  });

  allMaps.london.to = await Promise.all(
    allMaps.london.to.map(async (m) => {
      return {
        title: m.title,
        to: m.to,
        from: m.from,

        map: filterOutIrrelevantRoutes(
          m.map,
          from,
          await convertGroupToMainStation(m.to)
        ),
      };
    })
  );
  allMaps.london.from = await Promise.all(
    allMaps.london.from.map(async (m) => {
      return {
        title: m.title,
        to: m.to,
        from: m.from,

        map: filterOutIrrelevantRoutes(
          m.map,
          await convertGroupToMainStation(m.from),
          to
        ),
      };
    })
  );

  return allMaps;

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

  console.log("Got the routes: " + routes);

  //   console.table(routes);

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

function findRoutes(
  map,
  current,
  dest,
  path,
  allPaths,
  counter = { count: 1 }
) {
  if (counter.count > 20000) return;
  counter.count++; // UGLY!! Find the real problem!

  path.push(current);

  if (current == dest) {
    allPaths.push([...path]);
  } else {
    for (nb of map[current].neighbours) {
      //   console.log(`Calling findRoutes for ${nb.station} from ${current}`);
      if (!path.includes(nb.station))
        findRoutes(map, nb.station, dest, path, allPaths, counter);
    }
  }
  path.pop();
}

async function routeToMaps(from, to, colourPicker) {
  const regular = [];
  const london = { from: [], to: [] }; // London maps = combination of to London / from London

  const mapList = await routeToMapList(from, to);

  for (const mapCombination of mapList) {
    const maps = mapCombination.split(",");

    let currentMap = null;

    for (m of maps) {
      if (m == "LO") {
        // LONDON means we need to combine from => G01 => to
        console.log(`Need to deal with LO map`);
        const toLondonMaps = await routeToMaps(from, "G01", colourPicker);
        const fromLondonMaps = await routeToMaps("G01", to, colourPicker);

        toLondonMaps.regular.forEach((toMap) => {
          london.to.push({
            from,
            to: "G01",
            map: toMap.map,
            title: toMap.title,
          });
        });

        fromLondonMaps.regular.forEach((fromMap) => {
          london.from.push({
            from: "G01",
            to,
            map: fromMap.map,
            title: fromMap.title,
          });
        });
      }

      if (!currentMap) {
        currentMap = await getMap(m, colourPicker());
      } else {
        currentMap = fuseMaps(currentMap, await getMap(m, colourPicker()));
      }
    }
    if (mapCombination != "LO")
      regular.push({ title: mapCombination, map: currentMap });
  }

  return { regular, london };
}

module.exports = { routeToMaps, getPermittedRoutes };
