const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref(`/hiFromNikhil/`);

async function createMyMessage(sentence){
    return ref.set({
        header :sentence
    });
}

module.exports = {
    createMyMessage
};