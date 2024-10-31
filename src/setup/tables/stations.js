const fs = require("node:fs");
const readline = require("node:readline");

async function populateStations(file, db) {
  const stations = await extractStations(file);

  await db.query("DROP TABLE IF EXISTS stations;");

  await db.query(
    "CREATE TABLE stations (id VARCHAR(3) PRIMARY KEY, name VARCHAR(255));"
  );

  for (const station of stations) {
    db.query("INSERT INTO stations (id, name) VALUES ($1, $2);", [
      station.id,
      station.name,
    ]);
  }
}

module.exports = populateStations;
async function extractStations(file) {
  const fileStream = fs.createReadStream(file);

  const stations = [];

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  for await (const line of rl) {
    if (line.startsWith("/!!")) continue; // Ignore comments

    const isRootingPoint = line.includes("(a routing point)");

    if (line.startsWith("/")) {
      const station = line
        .split("")
        .slice(2)
        .join("")
        .replace(" (a routing point)", "");

      stations.push({ name: station, isRootingPoint });
    } else {
      const current = stations[stations.length - 1];
      const items = line.split(",");

      current.id = items[0];

      if (items[5] !== "") {
        current.stationGroup = items[5];
      }

      current.routingPoints = [];

      for (let i = 1; i < 5; i++) {
        if (items[i] !== "") {
          current.routingPoints.push(items[i]);
        }
      }

      if (current.routingPoints == []) delete current.routingPoints;

      //   console.log(stations[stations.length - 1]);
    }
  }

  return stations;
}
