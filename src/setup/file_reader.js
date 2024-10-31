const fs = require("node:fs");
const readline = require("node:readline");

function linewiseFileRead(filename) {
  const fileStream = fs.createReadStream(filename);

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return rl;
}

module.exports = linewiseFileRead;
