const linewiseFileRead = require("../file_reader");

async function populateCodeMap(file, db) {
  const codes = await extractCodeMap(file);

  await db.query("DROP TABLE IF EXISTS codemap;");

  await db.query(
    "CREATE TABLE codemap (nlc_code VARCHAR(5), crs_code VARCHAR(3));"
  );

  for (const code of codes) {
    db.query("INSERT INTO codemap (nlc_code, crs_code) VALUES ($1, $2);", [
      code.nlc,
      code.crs,
    ]);
  }
}

async function extractCodeMap(file) {
  const codes = [];

  for await (const line of linewiseFileRead(file)) {
    if (line.startsWith("/!!")) continue;

    const splitted = line.split(",");

    if (splitted[3].length == 0) continue;

    codes.push({ nlc: splitted[1], crs: splitted[3] });
  }

  return codes;
}

module.exports = { populateCodeMap };
