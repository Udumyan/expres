const path = require("path");

const createPath = (...args) => {
  return path.join(__dirname, "..", ...args);
};

module.exports = { createPath };
