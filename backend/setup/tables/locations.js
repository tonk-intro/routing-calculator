const linewiseFileRead = require("../file_reader");

async function populateLocations(file, db) {
  const locations = await extractLocations(file);

  await db.query("DROP TABLE IF EXISTS locations;");

  await db.query(
    "CREATE TABLE locations (station_id VARCHAR(3) PRIMARY KEY, lat REAL, long REAL);"
  );

  for (const loc of locations) {
    db.query(
      "INSERT INTO locations (station_id, lat, long) VALUES ($1, $2, $3);",
      [loc.id, loc.lat, loc.long]
    );
  }
}

async function extractLocations(file) {
  const locations = [];

  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("stationName,lat,long,crsCode,iataAirportCode"))
      continue; // Ignore first line

    const loc = line.split(",");

    locations.push({
      id: loc[3],
      lat: loc[1],
      long: loc[2],
    });
  }

  return locations;
}

module.exports = { populateLocations };
