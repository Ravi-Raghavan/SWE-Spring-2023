const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref("/knowledgeBase/");


var uid = "article_1";
ref.child(`${uid}`).set({
    title: "Who is Jeff Acevedo?"
})