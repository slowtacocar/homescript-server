const getTriggers = require("./lib/triggers");
const getDevices = require("./lib/devices");
const functions = require("./lib/functions");
const { VM } = require("vm2");

module.exports = class User {
  constructor(doc) {
    this.scripts = {};
    const globalUserData = doc.get("global");

    const setListener = async () => {
      this.triggers = await getTriggers(globalUserData);
      this.devices = await getDevices(globalUserData);
      this.unsubscribe = doc.ref
        .collection("scripts")
        .onSnapshot((snapshot) => {
          for (const change of snapshot.docChanges()) {
            if (change.type === "added") {
              this.startScript(change.doc);
            } else if (change.type === "removed") {
              this.scripts[change.doc.id].stop();
              delete this.scripts[change.doc.id];
            } else if (change.type === "modified") {
              this.scripts[change.doc.id].stop();
              this.startScript(change.doc);
            }
          }
        });
    };

    setListener();
  }

  remove() {
    this.unsubscribe();
    for (const script of this.scripts) {
      this.scripts[script].stop();
    }
  }

  startScript(doc) {
    const data = doc.data();
    this.scripts[doc.id] = new this.triggers[data.trigger.name](
      data.trigger.params
    );
    this.scripts[doc.id].run(() => {
      const vm = new VM({ sandbox: { ...this.devices, ...functions } });
      vm.run(`(async () => {${data.script}})()`);
    });
  }
};
