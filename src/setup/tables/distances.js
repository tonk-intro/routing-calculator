const linewiseFileRead = require("../file_reader");

async function populateDistances(file, db) {
  const distances = await extractDistances(file);

  //   console.log(distances);

  await db.query("DROP TABLE IF EXISTS distances;");

  await db.query(
    "CREATE TABLE distances (from_station VARCHAR(3), to_station VARCHAR(3), length NUMERIC);"
  );

  for (const distance of distances) {
    db.query(
      "INSERT INTO distances (from_station, to_station, length) VALUES ($1, $2, $3);",
      [distance.from, distance.to, +distance.length]
    );
  }
}

async function extractDistances(file) {
  const distances = [];
  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/!!")) continue;

    const distance = line.split(",");
    distances.push({
      from: distance[0],
      to: distance[1],
      length: distance[2],
    });
  }

  return distances;
}

module.exports = populateDistances;
