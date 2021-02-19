const lifx = require("./lifx");

module.exports = async (globalUserData) => ({
  ...(await lifx(globalUserData.lifx)),
});
