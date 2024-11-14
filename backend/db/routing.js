const pool = require("../../db_pool");
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

    // console.log("RP for " + stationId + " is " + );
  }

  return rows.map((rp) => rp.routing_point);
}

// takes an array of routing points and returns array where routing groups (e.g. G01)
// are replaced by all the group members
async function expandStationGroups(routingPoints) {
  const result = [];
  for (rp of routingPoints) {
    const transformed = await convertGroupToStations(rp);
    transformed.forEach((item) => result.push(item));
  }

  return result;
}

// Takes array of touring points and collapses the stations that have routing groups into them
async function contractStationGroups(routingPoints) {
  const result = [];

  for (rp of routingPoints) {
    const conv = await convertStationToGroup(rp);
    if (!result.includes(conv)) {
      result.push(conv);
    }
  }

  return result;
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
  expandStationGroups,
  contractStationGroups,
};
