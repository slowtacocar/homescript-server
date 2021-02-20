const lifx = require("./lifx");
const time = require("./time-device");

module.exports = async (globalUserData) => ({
  ...(await lifx(globalUserData.lifx)),
  ...(await time(globalUserData.time)),
});
