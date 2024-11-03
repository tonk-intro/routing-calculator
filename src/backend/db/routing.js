const pool = require("../../db_pool");
const { getStationById } = require("./stations");

async function getRoutingPoints(stationId) {
  const station = await getStationById(stationId);

  if (station.routing_point) return [station.id];

  const { rows } = await pool.query(
    "SELECT routing_point FROM routing_points WHERE station=$1",
    [stationId]
  );

  // The routing groups GXX are useless in practice because we cannot use them to look up fares
  // So here we translate them into station codes

  const rps = rows.map((rp) => rp.routing_point);
  const result = [];

  const pattern = /^G\d{2}$/;
  for (rp of rps) {
    if (pattern.test(rp)) {
      const stationId = await groupToStation(rp);
      result.push(stationId);
    } else {
      result.push(rp);
    }
  }

  return result;
}

async function groupToStation(groupId) {
  const { rows } = await pool.query(
    "SELECT station_id FROM station_groups_main WHERE group_id=$1",
    [groupId]
  );

  return rows[0].station_id;
}

module.exports = { getRoutingPoints };
