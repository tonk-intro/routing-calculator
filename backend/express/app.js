require("dotenv").config({ path: ".env" });

const { getAllStations } = require("../api/stations");
const { getRouteWithAllDetails, setup } = require("../api/routes");

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());

app.get("/stations", async (req, res) => {
  const stations = await getAllStations();
  res.json(stations);
});

app.get("/maps/:from/:to", async (req, res) => {
  const result = await getRouteWithAllDetails(req.params.from, req.params.to);

  res.json(result);
});

setup().then((res) => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Routing Calculator Backend - listening on port ${PORT}!`);
  });
});
