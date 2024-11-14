require("dotenv").config({ path: ".env" });
const pool = require("../db/pool");
const { setup, getRouteWithAllDetails } = require("../api/routes");

afterAll(() => {
  pool.end();
});

describe("Setup Requirements", () => {
  test("Forgetting Setup", async () => {
    expect(async () => await getRouteWithAllDetails(null, null)).toThrow();
  });
});
