const linewiseFileRead = require("../file_reader");

async function populateStations(file, db) {
  const stations = await extractStations(file);

  await db.query("DROP TABLE IF EXISTS stations;");
  await db.query("DROP TABLE IF EXISTS routing_points;");
  await db.query("DROP TABLE IF EXISTS routing_groups;");

  await db.query(
    "CREATE TABLE stations (id VARCHAR(3) PRIMARY KEY, name VARCHAR(255), routing_point BOOLEAN);"
  );

  await db.query(
    "CREATE TABLE routing_points (station VARCHAR(3), routing_point VARCHAR(3));"
  );

  await db.query(
    "CREATE TABLE routing_groups (station VARCHAR(3), routing_group VARCHAR(3));"
  );

  for (const station of stations) {
    db.query(
      "INSERT INTO stations (id, name, routing_point) VALUES ($1, $2, $3);",
      [station.id, station.name, station.isRootingPoint]
    );

    if (station.stationGroup) {
      db.query(
        "INSERT INTO routing_groups (station, routing_group) VALUES ($1, $2);",
        [station.id, station.stationGroup]
      );
    }

    for (rp of station.routingPoints) {
      db.query(
        "INSERT INTO routing_points (station, routing_point) VALUES ($1, $2);",
        [station.id, rp]
      );
    }
  }
}

async function extractStations(file) {
  const stations = [];

  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/!!")) continue; // Ignore comments

    const isRootingPoint = line.includes("(a routing point)");

    if (line.startsWith("/")) {
      const station = line
        .split("")
        .slice(2)
        .join("")
        .replace(" (a routing point)", "");

      stations.push({
        name: station,
        isRootingPoint,
        stationGroup: null,
        routingPoints: [],
      });
    } else {
      const current = stations[stations.length - 1];
      const items = line.split(",");

      current.id = items[0];

      if (items[5] !== "") {
        current.stationGroup = items[5];
      }

      for (let i = 1; i < 5; i++) {
        if (items[i] !== "") {
          current.routingPoints.push(items[i]);
        }
      }
    }
  }

  return stations;
}

module.exports = populateStations;
