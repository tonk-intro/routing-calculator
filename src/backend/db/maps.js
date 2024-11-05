const pool = require("../../db_pool");

async function getMap(mapId) {
  console.log(pool);

  const { rows } = await pool.query(
    "SELECT from_station, to_station FROM maps WHERE map_id=$1",
    [mapId]
  );

  const map = createMap(rows);
  console.log(map);
  return map;
}

function createMap(rows) {
  const map = {};

  for (item of rows) {
    if (!map[item.from_station]) {
      map[item.from_station] = {
        name: item.from_station,
        neighbours: [item.to_station],
      };
    } else {
      map[item.from_station].neighbours.push(item.to_station);
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

module.exports = { getMap, fuseMaps };
