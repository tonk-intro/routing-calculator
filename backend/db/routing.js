const pool = require("./pool");
const { getStationById } = require("./stations");

async function getRoutingPoints(stationId) {
  const station = await getStationById(stationId);

  if (station.routing_point) return [station.id];

  const { rows } = await pool.query(
    "SELECT routing_point FROM routing_points WHERE station=$1",
    [stationId]
  );

  if (rows.length == 0) {
    // This station isn't a routing point itself but also doesn't have any RP
    // associated with it. It must thus be a member of a station group.

    const { rows } = await pool.query(
      `SELECT routing_group FROM routing_groups WHERE station=$1`,
      [stationId]
    );

    if (rows.length == 0) {
      throw new Error("We didn't find a routing point for " + stationId);
    }

    return [rows[0].routing_group];
  }

  return rows.map((rp) => rp.routing_point);
}

async function convertStationToGroup(stationId) {
  const { rows } = await pool.query(
    "SELECT routing_group FROM routing_groups WHERE station=$1",
    [stationId]
  );

  if (rows.length == 0) return stationId;

  return rows[0].routing_group;
}

async function convertGroupToStations(groupId) {
  const pattern = /^G\d{2}$/;

  if (!pattern.test(groupId)) return [groupId];

  const { rows } = await pool.query(
    "SELECT station FROM routing_groups WHERE routing_group=$1",
    [groupId]
  );

  return rows.map((item) => item.station);
}

async function convertGroupToMainStation(groupId) {
  const pattern = /^G\d{2}$/;

  if (!pattern.test(groupId)) return groupId;

  const { rows } = await pool.query(
    "SELECT station_id FROM station_groups_main WHERE group_id=$1",
    [groupId]
  );

  return rows[0].station_id;
}

module.exports = {
  getRoutingPoints,
  convertGroupToMainStation,
  convertStationToGroup,
  convertGroupToStations,
};
