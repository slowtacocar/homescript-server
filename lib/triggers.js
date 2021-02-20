const time = require("./time");

module.exports = async (globalUserData) => ({
  ...(await time(globalUserData.time)),
});
