const pool = require("../../db_pool");

async function getStationById(id) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE id=$1;", [
    id,
  ]);

  // console.log(rows[0].name);

  return rows[0];
}

async function getStationByName(name) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE name=$1;", [
    name,
  ]);

  //   console.log(rows[0].id);

  return rows[0];
}

async function getAllStationIds() {
  const { rows } = await pool.query("SELECT id FROM stations;");

  return rows.map((item) => item.id);
}

module.exports = { getStationById, getStationByName, getAllStationIds };
