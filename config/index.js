const dev = require("./development");
const prod = require("./production");

let config;

if (process.env.NODE_ENV === "production") {
  config = prod;
}

if (process.env.NODE_ENV === "development") {
  config = dev;
}

if (!config) {
  throw new Error("NODE_ENV not set");
}

module.exports = config;
