admin = require("firebase-admin");
const { getStorage} = require('firebase-admin/storage');

var serviceAccount = require("./../json/firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://swe-spring-2023-default-rtdb.firebaseio.com",
  storageBucket: 'swe-spring-2023.appspot.com'
});


const storage = getStorage();
const bucket = storage.bucket();
module.exports = { admin, storage, bucket};
