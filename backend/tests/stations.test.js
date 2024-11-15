require("dotenv").config({ path: ".env" });
const pool = require("../db/pool");
const { getAllStations } = require("../api/stations");

afterAll(() => {
  pool.end();
});

describe("All Stations List", () => {
  test("Does it have lots of stations?", async () => {
    const stations = await getAllStations();
    console.log(stations);
    expect(stations.length > 2000).toBeTruthy();
  });
});
