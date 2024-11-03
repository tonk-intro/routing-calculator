const linewiseFileRead = require("../file_reader");

async function populateStationGroups(file, db) {
  const groups = await extractStationGroups(file);

  await db.query("DROP TABLE IF EXISTS station_groups_main;");

  await db.query(
    "CREATE TABLE station_groups_main (group_id VARCHAR(3), station_id VARCHAR(3));"
  );

  for (const g of groups) {
    db.query(
      "INSERT INTO station_groups_main (group_id, station_id) VALUES ($1, $2);",
      [g.group, g.station]
    );
  }
}

async function extractStationGroups(file) {
  const groups = [];
  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/")) continue;

    const group = line.split(",");

    groups.push({ group: group[0], station: group[1] });
  }

  return groups;
}

module.exports = { populateStationGroups };
