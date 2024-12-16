import pool from "./pool.js";
import type { Station } from "../types/shared.js";

export async function getStationById(id: string) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE id=$1;", [
    id,
  ]);

  // console.log(rows[0].name);

  if (rows.length == 0) throw new Error("No Station found for ID " + id);

  return rows[0];
}

export async function getStationOrGroupNameById(id: string): Promise<Station> {
  const pattern = /^G\d{2}$/;

  if (!pattern.test(id)) {
    return await getStationById(id);
  }

  const { rows } = await pool.query(
    "SELECT name FROM station_groups_main WHERE group_id=$1;",
    [id]
  );
  if (rows.length == 0) throw new Error("No station group found for ID " + id);

  return { name: rows[0].name, id: id };
}

export async function getStationByName(name: string) {
  const { rows } = await pool.query("SELECT * FROM stations WHERE name=$1;", [
    name,
  ]);

  if (rows.length == 0)
    throw new Error("No station group found for Name " + name);

  return rows[0];
}

interface StationsRow {
  id: string;
}

export async function getAllStationIds() {
  const { rows }: { rows: StationsRow[] } = await pool.query(
    "SELECT id FROM stations;"
  );

  return rows.map((item) => item.id);
}

export async function getAllStations(): Promise<Station[]> {
  const { rows } = await pool.query(
    "SELECT id, name, lat, long FROM stations JOIN locations ON stations.id = locations.station_id;"
  );

  return rows;
}
