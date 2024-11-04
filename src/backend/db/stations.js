const pool = require("../../db_pool");

async function getStationById(id) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE id=$1;", [
    id,
  ]);

  // console.log(rows[0].name);

  return rows[0];
}

async function getStationOrGroupById(id) {
  const pattern = /^G\d{2}$/;

  if (!pattern.test(id)) {
    return await getStationByName(id);
  }

  const { rows } = await pool.query(
    "SELECT name FROM station_groups_main WHERE group_id=$1;",
    [id]
  );

  return rows[0].name;
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

module.exports = {
  getStationById,
  getStationByName,
  getAllStationIds,
  getStationOrGroupById,
};
