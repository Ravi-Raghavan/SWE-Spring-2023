admin = require("firebase-admin");

var serviceAccount = require("./../json/firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://swe-spring-2023-default-rtdb.firebaseio.com",
});

module.exports = { admin };
