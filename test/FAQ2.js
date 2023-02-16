//test search strategy to fetch articles from FAQ collection via searchingconst admin = require("../firebase").admin;
const admin = require("../firebase").admin;

var db = admin.database();
var ref = db.ref("/FAQ/");

ref.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      var topicList = childData.topics;
    });
  });