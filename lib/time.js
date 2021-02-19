const schedule = require("node-schedule");
const SunCalc = require("suncalc");

module.exports = async () => ({
  Schedule: class Schedule {
    constructor({ dayOfWeek, hour, minute, second }) {
      this.rule = new schedule.RecurrenceRule();
      this.rule.dayOfWeek = dayOfWeek;
      this.rule.hour = hour;
      this.rule.minute = minute;
      this.rule.second = second;
    }

    run(callback) {
      this.job = schedule.scheduleJob(this.rule, callback);
    }

    stop() {
      this.job.cancel();
    }
  },
  Sunrise: class Sunrise {
    constructor({ long, lat }) {
      this.long = long;
      this.lat = lat;
      this.rule = new schedule.RecurrenceRule();
      this.rule.minute = 0;
      this.rule.hour = 0;
    }

    run(callback) {
      this.job = schedule.scheduleJob(this.rule, () => {
        schedule.scheduleJob(
          SunCalc.getTimes(new Date(), this.long, this.lat).sunrise,
          callback
        );
      });
    }
  },
  Sunset: class Sunset {
    constructor({ long, lat }) {
      this.long = long;
      this.lat = lat;
      this.rule = new schedule.RecurrenceRule();
      this.rule.minute = 0;
      this.rule.hour = 0;
    }

    run(callback) {
      this.job = schedule.scheduleJob(this.rule, () => {
        schedule.scheduleJob(
          SunCalc.getTimes(new Date(), this.long, this.lat).sunset,
          callback
        );
      });
    }
  },
});
