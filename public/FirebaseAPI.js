//helper functions to interface with Firebase API 

const { createMockUserToken } = require("@firebase/util");
var CryptoJS = require("crypto-js");
const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref("/users/");


//Function to create a user in our database
//userParameters: parameters for a particular user(i.e. name, email, etc)
async function createUser(userParameters, response){

    //Create the user in the authentication table
    let userCredentials = await admin.auth().createUser({
        email: userParameters.email,
        emailVerified: userParameters.emailVerified, 
        password: userParameters.password,
        displayName: userParameters.displayName,
        photoURL: userParameters.photoURL,
        disabled: userParameters.disabled
    })
    
    //Create the user in the database table
    var userRecord = userCredentials.toJSON();

    var uid = userRecord.uid;
    ref.child(`${uid}`).set({
        uid: uid,
        email: userRecord.email,
        emailVerified: userParameters.emailVerified,
        password: userParameters.password, 
        displayName: userParameters.displayName,
        photoURL: userParameters.photoURL,
        disabled: userParameters.disabled
    })

    //Send Request
    var userRecord = userCredentials.toJSON();
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
    response.end();
}

//This function is responsible for searching for a user in the database. Returns "True" if user is there. Else, returns "False"
async function searchUser(searchParameters){
    var email = searchParameters.email;

    var doesExist = await new Promise((resolve, reject) => {
        admin.auth().getUserByEmail(email)
        .then((userCredentials) => {
            var userRecord = userCredentials.toJSON();
            resolve(JSON.stringify(userRecord));
        })
        .catch((err) => {
            if (err.code == 'auth/user-not-found'){
                resolve("N/A")
            }
        })
    })

    return doesExist;
}

//function which checks if a user's email has been validated yet
async function checkUserValidation(uid, response){
    ref.child(`${uid}`).on('value', (snapshot) => {
        var value = snapshot.val();
        if (value == null){
            response.writeHead(200, { "Content-type": "text/plain" });
            response.write("false");
            response.end();
        }
        else{
            var isValidated = value["emailVerified"];

            var responseContent = "false";
            if (isValidated){
                responseContent = "true";
            }

            response.writeHead(200, { "Content-type": "text/plain" });
            response.write(responseContent);
            response.end();
        }
    })
}

module.exports = {
    createUser: createUser,
    searchUser: searchUser,
    checkUserValidation: checkUserValidation
}