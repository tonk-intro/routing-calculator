require("dotenv").config({ path: ".env" });

const { getAllStations } = require("../api/stations");
const { getRouteWithAllDetails, setup } = require("../api/routes");

const express = require("express");
const app = express();

const cors = require("cors");
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

app.use((err, req, res, next) => {
  res.json({ error: true, errorMsg: err.message });
});

setup().then((res) => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Routing Calculator Backend - listening on port ${PORT}!`);
  });
});
