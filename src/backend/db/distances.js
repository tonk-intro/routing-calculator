const pool = require("../../db_pool");

async function getNeighbours(station) {
  const { rows } = await pool.query(
    "SELECT to_station, length FROM distances WHERE from_station=$1",
    [station]
  );

  return rows;
}

async function getDistance(from, to) {
  const { rows } = await pool.query(
    "SELECT length FROM distances WHERE from_station=$1 AND to_station=$2",
    [from, to]
  );

  return rows[0].length;
}
module.exports = { getNeighbours, getDistance };
