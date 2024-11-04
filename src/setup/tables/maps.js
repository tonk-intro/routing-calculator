const linewiseFileRead = require("../file_reader");

async function populateMaps(file, db) {
  const maps = await extractMaps(file);

  console.log(maps);

  await db.query("DROP TABLE IF EXISTS maps;");

  await db.query(
    "CREATE TABLE maps (map_id VARCHAR(3), from_station VARCHAR(3), to_station VARCHAR(3));"
  );

  for (const m of maps) {
    db.query(
      "INSERT INTO maps (from_station, to_station , map_id) VALUES ($1, $2, $3);",
      [m.from, m.to, m.map]
    );
  }
}

async function extractMaps(file) {
  const maps = [];

  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/")) continue;

    const mapEntry = line.split(",");

    maps.push({ from: mapEntry[0], to: mapEntry[1], map: mapEntry[2] });
  }

  return maps;
}

module.exports = { populateMaps };
