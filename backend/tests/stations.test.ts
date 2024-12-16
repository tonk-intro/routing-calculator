import "dotenv/config.js";
import pool from "../db/pool.js";
import getAllStations from "../api/stations.js";

import { describe, expect, afterAll, test } from "vitest";

afterAll(() => {
  pool.end();
});

describe("All Stations List", () => {
  test("Does it have lots of stations?", async () => {
    const stations = await getAllStations();
    // console.log(stations);
    expect(stations.length > 2000).toBeTruthy();
  });
});
