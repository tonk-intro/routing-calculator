import { routeToMapList, getMap, fuseMaps } from "../db/maps.js";
import { convertGroupToMainStation } from "../db/routing.js";

import type { MapContainer, Map, PermittedRouteMaps } from "../types/shared.js";

function getColourPicker() {
  const colours = ["red", "blue", "green", "black", "purple", "orange"];
  let count = 0;
  return () => {
    return colours[count++ % (colours.length - 1)];
  };
}

export async function getPermittedRoutes(
  from: string,
  to: string
): Promise<PermittedRouteMaps<MapContainer>> {
  const cp = getColourPicker();
  const allMaps = await routeToMaps(from, to, cp);

  // Now we can forget about the station ids
  from = await convertGroupToMainStation(from);
  to = await convertGroupToMainStation(to);
  return allMaps;
}

export function filterOutIrrelevantRoutes(map: Map, from: string, to: string) {
  const routes: string[][] = [];

  findRoutes(map, from, to, [], routes);

  const usedStations = routes.reduce((prev, cur) => {
    for (const item of cur) {
      if (!prev.includes(item)) prev.push(item);
    }
    return prev;
  }, []);

  const filteredMap: Map = {};

  for (const node in map) {
    if (usedStations.includes(node)) {
      filteredMap[node] = { name: node, neighbours: [] };
      for (const nb of map[node].neighbours) {
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
  map: Map,
  current: string,
  dest: string,
  path: string[],
  allPaths: string[][],
  counter = { count: 1 }
) {
  if (counter.count > 20000) {
    // console.log("QUITTING SEARCH");
    return;
  }
  counter.count++; // UGLY!! Find the real problem!

  path.push(current);

  if (current == dest) {
    allPaths.push([...path]);
  } else {
    for (const nb of map[current].neighbours) {
      //   console.log(`Calling findRoutes for ${nb.station} from ${current}`);
      if (!path.includes(nb.station))
        findRoutes(map, nb.station, dest, path, allPaths, counter);
    }
  }
  path.pop();
}

type ColourPickerFunction = () => string;

export async function routeToMaps(
  from: string,
  to: string,
  colourPicker: ColourPickerFunction
): Promise<PermittedRouteMaps<MapContainer>> {
  const regular: MapContainer[] = [];
  const london: { from: MapContainer[]; to: MapContainer[] } = {
    from: [],
    to: [],
  }; // London maps = combination of to London / from London

  const mapList = await routeToMapList(from, to);

  for (const mapCombination of mapList) {
    const maps = mapCombination.split(",");

    let currentMap = null;

    for (const m of maps) {
      if (m == "LO") {
        // LONDON means we need to combine from => G01 => to
        // console.log(`Need to deal with LO map`);
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
    if (!currentMap)
      throw new Error("Urgh, we unexpectedly don't have a map to add!");

    if (mapCombination != "LO")
      regular.push({
        title: mapCombination.replaceAll(",", "+"),
        map: currentMap,
        from,
        to,
      });
  }

  return { regular, london };
}
