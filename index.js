const admin = require("./admin");
const User = require("./user");

let users = {};

admin
  .firestore()
  .collection("user")
  .onSnapshot((snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === "added") {
        users[change.doc.id] = new User(change.doc);
      } else if (change.type === "removed") {
        users[change.doc.id].remove();
        delete users[change.doc.id];
      }
    }
  });
