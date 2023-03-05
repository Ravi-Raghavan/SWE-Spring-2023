const admin = require("./firebase").admin;

var db = admin.database();
var ref = db.ref("/Orders/");

var oid = "192457395872";
ref.child(`${oid}`).set({
    title: "Tylenol",
    price: 10.00,
    uid: "akdsjfljdas",
    status: "pending"
})

ref.child(`${oid}`).on("value", (snapshot) => {
    console.log(snapshot.val());
})
