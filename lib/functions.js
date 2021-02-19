const SunCalc = require("suncalc");

module.exports = {
  hasSunSet: (long, lat) => {
    const now = new Date();
    const times = SunCalc.getTimes(now, long, lat);
    if (now.getTime() < times.sunrise.getTime()) {
      return true;
    } else if (now.getTime() < times.sunset.getTime()) {
      return false;
    } else {
      return true;
    }
  },
};
