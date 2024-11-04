const linewiseFileRead = require("../file_reader");

async function populateRoutes(file, db) {
  const routes = await extractRoutes(file);

  //   console.log(routes);

  await db.query("DROP TABLE IF EXISTS routes;");

  await db.query(
    "CREATE TABLE routes (from_station VARCHAR(255), to_station VARCHAR(255), map_id VARCHAR(255));"
  );

  for (const r of routes) {
    for (const m of r.maps) {
      db.query(
        "INSERT INTO routes (from_station, to_station, map_id) VALUES ($1, $2, $3);",
        [r.from, r.to, m]
      );
    }
  }
}

async function extractRoutes(file) {
  const routes = [];

  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/!!")) continue; // Ignore comments

    if (line.startsWith("/")) {
      const route = line.split("").slice(2).join("").split(" - ");
      routes.push({ from: route[0], to: route[1], maps: [] });
    } else {
      routes[routes.length - 1].maps.push(line);
    }
  }

  return routes;
}

module.exports = { populateRoutes };
