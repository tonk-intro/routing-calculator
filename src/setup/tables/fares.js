const linewiseFileRead = require("../file_reader");

async function populateFares(file, db) {
  const fares = await extractFares(file);

  console.log("Fares extracted: " + fares.length);

  throw new Error("Are you sure?!");
  await db.query("DROP TABLE IF EXISTS fares;");

  await db.query(
    "CREATE TABLE fares (from_nlc VARCHAR(5), to_nlc VARCHAR(5), fare NUMERIC, type VARCHAR(3));"
  );

  let nr = 0;

  for (const fare of fares) {
    console.log("Inserting fare " + nr++);

    await db.query(
      "INSERT INTO fares (from_nlc, to_nlc, fare, type) VALUES ($1, $2, $3, $4);",
      [fare.from, fare.to, fare.fare, fare.type]
    );
  }
}

async function extractFares(file) {
  const fares = [];

  for await (const line of linewiseFileRead(file)) {
    const splitted = line.split("");

    const type = splitted.slice(13, 16).join("");

    if (type != "SDS" && type != "SOS") continue;

    const from = splitted.slice(0, 4).join("");
    const to = splitted.slice(4, 8).join("");
    const fare = +splitted.slice(16, 22).join("") / 100;

    fares.push({ from, to, fare, type });
  }

  return fares;
}

module.exports = { populateFares };
