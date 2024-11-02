const pool = require("../../db_pool");
const { getStationById } = require("./stations");

async function getRoutingPoints(stationId) {
  const station = await getStationById(stationId);

  if (station.routing_point) return [station.id];

  const { rows } = await pool.query(
    "SELECT routing_point FROM routing_points WHERE station=$1",
    [stationId]
  );

  return rows.map((rp) => rp.routing_point);
}
module.exports = { getRoutingPoints };
