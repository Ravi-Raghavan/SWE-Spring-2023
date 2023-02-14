//test file to create a bunch of dummy FAQ files and store them in firebase 
const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref("/FAQ/");




// var uid = "article_1";
// ref.child(`${uid}`).set({
//     title: "Who is Jeff Acevedo?",
//     snippet: "",
//     category: ''
// })

