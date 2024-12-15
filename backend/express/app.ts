import "dotenv/config.js";

import getAllStations from "../api/stations.js";
import { getRouteWithAllDetails, setup } from "../api/routes.js";

console.log(process.env.DB_HOST);

import express from "express";
const app = express();

import cors from "cors";
// const { serialize } = require("v8");

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/stations", async (req, res) => {
  const stations = await getAllStations();
  res.json(stations);
});

app.get("/maps/:from/:to", async (req, res, next) => {
  try {
    const result = await getRouteWithAllDetails(req.params.from, req.params.to);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  res.json({ error: true, errorMsg: err.message });
});

setup().then((res) => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Routing Calculator Backend - listening on port ${PORT}!`);
  });
});
