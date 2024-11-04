const pool = require("../../db_pool");

const { convertGroupToStation } = require("./routing");

async function getFare(from, to) {
  // We don't have fares for CRS group codes like G12. So convert those first
  const fromCrs = await convertGroupToStation(from);
  const toCrs = await convertGroupToStation(to);

  const fromNlc = await convertCrsToNlc(fromCrs);
  const toNlc = await convertCrsToNlc(toCrs);

  const { rows } = await pool.query(
    "SELECT fare FROM fares WHERE from_nlc=$1 AND to_nlc=$2",
    [fromNlc, toNlc]
  );

  if (rows.length == 0)
    throw new Error("Couldn't get fare from " + from + " to " + to);

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
