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

  // A passenger wants to go from Lydney to Church Stretton.
  // The info in the official documentation seems out of date.
  // Routing Points: NWP, GCR, G05 ==> CRV
  // SHR is NOT a valid RP!
  // Maps: MC, WT+MC, PB+CA, MP
  test("Lydney to Church Stretton", async () => {
    const result = await getRouteWithAllDetails("Lydney", "Church Stretton");

    expect(result.routingPoints.from).toEqual(["NWP", "GCR", "G05"]);
    expect(result.routingPoints.to).toEqual(["CRV"]);

    expect(
      result.maps.reduce((prev, cur) => {
        return [...prev, cur.map.title];
      }, [])
    ).toEqual(["MC", "PB,CA", "WT,MC", "MP"]);
  });
});
