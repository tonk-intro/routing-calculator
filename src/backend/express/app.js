require("dotenv").config({ path: ".env" });

const { getMap, fuseMaps } = require("../db/maps");

async function testMap() {
  //   await getMap("AA");
  const ce = await getMap("CE");
  const we = await getMap("WE");

  return fuseMaps(ce, we);
}

const express = require("express");
const app = express();

console.log(process.env);

app.get("/maps/:id", async (req, res) => {
  const map = await testMap();
  // code to retrieve an article...
  res.json(map);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Routing Calculator Backend - listening on port ${PORT}!`);
});
