require("dotenv").config({ path: ".env" });
const pool = require("../db/pool");
const { setup, getRouteWithAllDetails } = require("../api/routes");

afterAll(() => {
  pool.end();
});

describe("Setup Requirements", () => {
  test("Forgetting Setup", async () => {
    await expect(
      async () => await getRouteWithAllDetails(null, null)
    ).rejects.toThrow();
  });
});

describe("Common Routing Points", () => {
  beforeAll(async () => {
    await setup();
  });

  // Example (a) - Battle to Headcorn - common routeing point Tonbridge

  test("Battle to Headcorn", async () => {
    const result = await getRouteWithAllDetails("Battle", "Headcorn");

    expect(result.haveSharedRP).toBeTruthy();
    expect(result.sharedRP).toBe("TON");
    console.log(result);
  });

  // Example (c) - Helsby to Capenhurst. Each station has two common routeing points, Chester (13
  // (actual 12.80) miles) and Hooton (12 ¼ (actual 12.29 ) miles. In this instance travel via
  // Hooton is the permitted route.

  test("Helsby to Capenhurst", async () => {
    const result = await getRouteWithAllDetails("Helsby", "Capenhurst");

    expect(result.haveSharedRP).toBeTruthy();
    expect(result.sharedRP).toBe("HOO");
    console.log(result);
  });
});
