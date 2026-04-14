const crypto = require("crypto");

function sha256(input) {
  return crypto.createHash("sha256").update(input || "", "utf8").digest("hex");
}

module.exports = { sha256 };


