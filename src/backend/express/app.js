require("dotenv").config({ path: ".env" });

const { getMap, fuseMaps } = require("../db/maps");

async function testMap() {
  //   await getMap("AA");
  //MP+CG+EG+FW
  const one = await getMap("MP");
  const two = await getMap("CG");
  const three = await getMap("EG");
  const four = await getMap("FW");

  return fuseMaps(fuseMaps(fuseMaps(one, two), three), four);
}

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());

console.log(process.env);

app.get("/maps/:id", async (req, res) => {
  const map = await testMap();
  res.json(map);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Routing Calculator Backend - listening on port ${PORT}!`);
});
