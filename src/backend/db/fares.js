const pool = require("../../db_pool");

async function getFare(from, to) {
  const fromNlc = await convertCrsToNlc(from);
  const toNlc = await convertCrsToNlc(to);

  const { rows } = await pool.query(
    "SELECT fare FROM fares WHERE from_nlc=$1 AND to_nlc=$2",
    [fromNlc, toNlc]
  );

  return rows[0].fare;
}

async function convertCrsToNlc(crs) {
  const { rows } = await pool.query(
    "SELECT nlc_code FROM codemap WHERE crs_code=$1",
    [crs]
  );

  if (rows.length == 0) {
    throw new Error(`Unable to resolve CRS-Code: ${crs}`);
  }

  return rows[0].nlc_code;
}

module.exports = { getFare };
