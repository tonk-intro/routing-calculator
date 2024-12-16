import "dotenv/config.js";

import { describe, expect, afterAll, beforeAll, test } from "vitest";

import pool from "../db/pool.js";
import { setup, getRouteWithAllDetails } from "../api/routes.js";

afterAll(() => {
  pool.end();
});

describe(
  "Map Selection",
  () => {
    beforeAll(async () => {
      await setup();
    });

    // Example (e) - Darlington to Shrewsbury via permitted route YM+BY+CA. This allows travel from
    // Darlington to York via Map YM, York to Wolverhampton via Map BY and Wolverhampton to
    // Shrewsbury via Map CA.

    test("Darlington to Shrewsbury", async () => {
      const result = await getRouteWithAllDetails("Darlington", "Shrewsbury");
      expect(
        result.maps.regular.some((item) => item.title == "YM+BY+CA")
      ).toBeTruthy();
    });

    // A passenger wants to go from Lydney to Church Stretton.
    // The info in the official documentation seems out of date.
    // Routing Points: NWP, GCR, G05 ==> CRV
    // SHR is NOT a valid RP!
    // Maps: MC, WT+MC, PB+CA, MP
    test("Lydney to Church Stretton", async () => {
      // jest.setTimeout(1000000);

      const result = await getRouteWithAllDetails("Lydney", "Church Stretton");

      expect(result.routingPoints.from.map((rp) => rp.id)).toEqual([
        "NWP",
        "GCR",
        "G05",
      ]);
      expect(result.routingPoints.to.map((rp) => rp.id)).toEqual(["CRV"]);

      expect(
        result.maps.regular.reduce((prev: any, cur: any) => {
          return [...prev, cur.title];
        }, [])
      ).toEqual(["MC", "PB+CA", "WT+MC", "MP"]);
    });
  },
  { timeout: 1000000 }
);
