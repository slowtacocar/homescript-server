const time = require("./time");

module.exports = async () => ({
  ...(await time()),
});
