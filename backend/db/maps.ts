import pool from "./pool.js";
import type { Map } from "../types/shared.js";

import { convertGroupToMainStation } from "./routing.js";

interface RoutesRow {
  map_id: string;
}

export async function routeToMapList(from: string, to: string) {
  const { rows }: { rows: RoutesRow[] } = await pool.query(
    "SELECT map_id FROM routes WHERE from_station=$1 AND to_station=$2",
    [from, to]
  );

  return rows.map((item) => item.map_id);
}

interface MapsRow {
  from_station: string;
  to_station: string;
}

export async function getMap(mapId: string, colour = "red") {
  const { rows } = await pool.query(
    "SELECT from_station, to_station FROM maps WHERE map_id=$1",
    [mapId]
  );

  // We do the re-labelling here -- ideally should be done elsewhere though
  // Turn GXX station groups into representative stations

  for (const r of rows) {
    r.from_station = await convertGroupToMainStation(r.from_station);
    r.to_station = await convertGroupToMainStation(r.to_station);
  }

  const map = createMap(rows, colour);
  //   console.log(map);
  return map;
}

function createMap(rows: MapsRow[], colour: string) {
  const map: Map = {};

  for (const item of rows) {
    if (!map[item.from_station]) {
      map[item.from_station] = {
        name: item.from_station,
        neighbours: [{ station: item.to_station, colour }],
      };
    } else {
      map[item.from_station].neighbours.push({
        station: item.to_station,
        colour,
      });
    }
  }

  return map;
}

export function fuseMaps(first: Map, second: Map) {
  const result = structuredClone(first);

  for (const item in second) {
    if (!first[item]) {
      // this is a station no on the first map
      result[item] = structuredClone(second[item]);
    } else {
      // a station that is on both maps!

      result[item].neighbours = [
        ...new Set([...first[item].neighbours, ...second[item].neighbours]),
      ];
    }
  }

  return result;
}
