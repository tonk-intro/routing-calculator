const linewiseFileRead = require("../file_reader");

async function populateRoutes(file, db) {
  const routes = await extractRoutes(file);

  //   console.log(routes);

  await db.query("DROP TABLE IF EXISTS routes;");

  await db.query(
    "CREATE TABLE routes (from_station VARCHAR(3), to_station VARCHAR(3), map_id VARCHAR(255));"
  );

  for (const r of routes) {
    // for (const m of r.maps) {
    await db.query(
      "INSERT INTO routes (from_station, to_station, map_id) VALUES ($1, $2, $3);",
      [r.from, r.to, r.maps]
    );
    // }
  }
}

async function extractRoutes(file) {
  const routes = [];

  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/")) continue; // Ignore comments

    const route = line.split(",");
    const from = route[0];
    const to = route[1];

    route.splice(0, 2);

    routes.push({ from, to, maps: route.join(",") });
  }

  return routes;
}

module.exports = { populateRoutes };
