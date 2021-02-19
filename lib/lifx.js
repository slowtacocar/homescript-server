const axios = require("axios");
const camelCase = require("lodash/camelCase");

class Lifx {
  constructor(selector, apiKey) {
    this.selector = selector;
    this.apiKey = apiKey;
  }

  async isOn() {
    const res = await axios.get(
      `https://api.lifx.com/v1/lights/${this.selector}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return res.data[0].power === "on";
  }

  async getBrightness() {
    const res = await axios.get(
      `https://api.lifx.com/v1/lights/${this.selector}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return res.data.brightness;
  }

  async turnOff(duration) {
    await axios.put(
      `https://api.lifx.com/v1/lights/${this.selector}/state`,
      {
        power: "off",
        duration,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
  }

  async turnOn(duration) {
    await axios.put(
      `https://api.lifx.com/v1/lights/${this.selector}/state`,
      {
        power: "on",
        duration,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
  }

  async setBrightness(brightness) {
    await axios.put(
      `https://api.lifx.com/v1/lights/${this.selector}/state`,
      {
        brightness,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
  }

  async setColor(color) {
    await axios.put(
      `https://api.lifx.com/v1/lights/${this.selector}/state`,
      {
        color,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
  }
}

module.exports = async (lifxUserData) => {
  const res = await axios.get("https://api.lifx.com/v1/lights/all", {
    headers: {
      Authorization: `Bearer ${lifxUserData.apiKey}`,
    },
  });

  const lights = {};

  for (const light of res.data) {
    lights[camelCase(light.label)] = new Lifx(
      `id:${light.id}`,
      lifxUserData.apiKey
    );
    const group = camelCase(light.group.name);
    if (!lights[group]) {
      lights[group] = new Lifx(
        `group_id:${light.group.id}`,
        lifxUserData.apiKey
      );
    }
  }

  return lights;
};
