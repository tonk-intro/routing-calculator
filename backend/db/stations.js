const pool = require("./pool");

async function getStationById(id) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE id=$1;", [
    id,
  ]);

  // console.log(rows[0].name);

  if (rows.length == 0) throw new Error("No Station found for ID " + id);

  return rows[0];
}

async function getStationOrGroupNameById(id) {
  const pattern = /^G\d{2}$/;

  if (!pattern.test(id)) {
    return await getStationById(id);
  }

  const { rows } = await pool.query(
    "SELECT name FROM station_groups_main WHERE group_id=$1;",
    [id]
  );
  if (rows.length == 0) throw new Error("No station group found for ID " + id);

  return rows[0].name;
}

async function getStationByName(name) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE name=$1;", [
    name,
  ]);

  if (rows.length == 0)
    throw new Error("No station group found for Name " + name);

  return rows[0];
}

async function getAllStationIds() {
  const { rows } = await pool.query("SELECT id FROM stations;");

  return rows.map((item) => item.id);
}

async function getAllStations() {
  const { rows } = await pool.query(
    "SELECT id, name, lat, long FROM stations JOIN locations ON stations.id = locations.station_id;"
  );

  return rows;
}

module.exports = {
  getStationById,
  getStationByName,
  getAllStationIds,
  getStationOrGroupNameById,
  getAllStations,
};
