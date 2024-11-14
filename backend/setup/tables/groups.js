const linewiseFileRead = require("../file_reader");

async function populateStationGroups(file, db) {
  const groups = await extractStationGroups(file);

  await db.query("DROP TABLE IF EXISTS station_groups_main;");

  await db.query(
    "CREATE TABLE station_groups_main (group_id VARCHAR(3), station_id VARCHAR(3), name VARCHAR(255));"
  );

  for (const g of groups) {
    db.query(
      "INSERT INTO station_groups_main (group_id, station_id, name) VALUES ($1, $2, $3);",
      [g.group, g.station, g.name]
    );
  }
}

async function extractStationGroups(file) {
  const groups = [];
  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/!!")) continue;

    if (line.startsWith("/")) {
      const name = line.split("").slice(2).join("");

      groups.push({ name });
    } else {
      const group = line.split(",");
      groups[groups.length - 1].group = group[0];
      groups[groups.length - 1].station = group[1];
    }
  }

  return groups;
}

module.exports = { populateStationGroups };
