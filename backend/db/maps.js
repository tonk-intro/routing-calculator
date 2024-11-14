const pool = require("./pool");

const { convertGroupToMainStation } = require("./routing");

async function routeToMapList(from, to) {
  const { rows } = await pool.query(
    "SELECT map_id FROM routes WHERE from_station=$1 AND to_station=$2",
    [from, to]
  );

  return rows.map((item) => item.map_id);
}

async function getMap(mapId, colour = "red") {
  const { rows } = await pool.query(
    "SELECT from_station, to_station FROM maps WHERE map_id=$1",
    [mapId]
  );

  // We do the re-labelling here -- ideally should be done elsewhere though
  // Turn GXX station groups into representative stations

  for (r of rows) {
    r.from_station = await convertGroupToMainStation(r.from_station);
    r.to_station = await convertGroupToMainStation(r.to_station);
  }

  const map = createMap(rows, colour);
  //   console.log(map);
  return map;
}

function createMap(rows, colour) {
  const map = {};

  for (item of rows) {
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

function fuseMaps(first, second) {
  const result = structuredClone(first);

  for (item in second) {
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

module.exports = { getMap, fuseMaps, routeToMapList };
