import pool from "./pool.js";

export interface Neighbour {
  length: string;
  to_station: string;
}

export async function getNeighbours(station: string): Promise<Neighbour[]> {
  const { rows } = await pool.query(
    "SELECT to_station, length FROM distances WHERE from_station=$1",
    [station]
  );

  return rows;
}

export async function getDistance(from: string, to: string) {
  const { rows } = await pool.query(
    "SELECT length FROM distances WHERE from_station=$1 AND to_station=$2",
    [from, to]
  );

  return rows[0].length;
}
