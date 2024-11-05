require("dotenv").config({ path: ".env" });

const { getMap, fuseMaps } = require("./db/maps");

async function test() {
  //   await getMap("AA");
  const ce = await getMap("CE");
  const we = await getMap("WE");

  console.log(fuseMaps(ce, we));
}

test();
