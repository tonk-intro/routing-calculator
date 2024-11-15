require("dotenv").config({ path: ".env" });
const pool = require("../db/pool");
const { setup, getRouteWithAllDetails } = require("../api/routes");

afterAll(() => {
  pool.end();
});

describe("Map Selection", () => {
  beforeAll(async () => {
    await setup();
  });

  // Example (e) - Darlington to Shrewsbury via permitted route YM+BY+CA. This allows travel from
  // Darlington to York via Map YM, York to Wolverhampton via Map BY and Wolverhampton to
  // Shrewsbury via Map CA.

  test("Darlington to Shrewsbury", async () => {
    const result = await getRouteWithAllDetails("Darlington", "Shrewsbury");
    expect(
      result.maps.some((item) => item.map.title == "YM,BY,CA")
    ).toBeTruthy();
  });
});
