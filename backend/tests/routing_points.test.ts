import "dotenv/config.js";
import pool from "../db/pool";
import { setup, getRouteWithAllDetails } from "../api/routes";
import { describe, expect, afterAll, beforeAll, test } from "vitest";

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
    expect(result.sharedRP.id).toBe("TON");
  });

  // Example (c) - Helsby to Capenhurst. Each station has two common routeing points, Chester (13
  // (actual 12.80) miles) and Hooton (12 ¼ (actual 12.29 ) miles. In this instance travel via
  // Hooton is the permitted route.

  test("Helsby to Capenhurst", async () => {
    const result = await getRouteWithAllDetails("Helsby", "Capenhurst");

    expect(result.haveSharedRP).toBeTruthy();
    expect(result.sharedRP.id).toBe("HOO");
  });
});

describe("Distinct Routing Points", () => {
  beforeAll(async () => {
    await setup();
  });

  // Example (b) - Gunnislake to Crewkerne - routeing points are Plymouth Group, Salisbury and
  // Exeter Group.
  // Plymouth Group = G21, Exeter Group = G12
  // !!!: The documentation includes SAL but not the official routing calculator that is online!
  // I follow the latter as this corresponds to the data.

  test(
    "Gunnislake to Crewkerne",
    async () => {
      const result = await getRouteWithAllDetails("Gunnislake", "Crewkerne");

      // console.log(result);
      expect(
        result.routingPoints.from.map((rp) => rp.id).includes("G21")
      ).toBeTruthy();
      expect(
        result.routingPoints.to.map((rp) => rp.id).includes("G12")
      ).toBeTruthy();
      // expect(result.routingPoints.to.includes("SAL")).toBeTruthy();
    },
    { timeout: 10000 }
  );

  // Example 1: HERNE BAY TO GRAVESEND
  test("Herne Bay to Gravesend", async () => {
    const result = await getRouteWithAllDetails("Herne Bay", "Gravesend");
    expect(result.routingPoints.from.map((rp) => rp.id)).toEqual(["FAV"]);
    expect(result.routingPoints.to.map((rp) => rp.id)).toEqual(["GRV"]);
  });

  // Example 2: PAR TO PONTYPRIDD
  // For some reason one cannot put Par into the official route calculator
  // I am therefore using nearbby Lostwithiel instead

  test("Lostwithiel to Pontypridd", async () => {
    const result = await getRouteWithAllDetails("Lostwithiel", "Pontypridd");

    expect(result.routingPoints.from.map((rp) => rp.id)).toEqual(["LSK"]);
    expect(result.routingPoints.to.map((rp) => rp.id)).toEqual(["PPD"]);
  });
});
