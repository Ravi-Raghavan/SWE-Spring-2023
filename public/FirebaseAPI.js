//helper functions to interface with Firebase API 
var CryptoJS = require("crypto-js");
const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref(`/users/`);

//Function to create a user(i.e. registration!) in our database
//userParameters: parameters for a particular user(i.e. name, email, etc)
async function register(userParameters, response){

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
    var accountType = userParameters.accountType;

    userRecord["metadata"]["lastSignInTime"] = new Date().toString();
    userRecord["Account Type"] = accountType;

    var uid = userRecord.uid;
    ref.child(`${uid}`).set({
        uid: uid,
        email: userRecord.email,
        emailVerified: userParameters.emailVerified,
        password: userParameters.password, 
        displayName: userParameters.displayName,
        photoURL: userParameters.photoURL,
        disabled: userParameters.disabled,
        accountType: accountType
    })

    //Send Request
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
    response.end();
}

//This function is responsible for searching for a user in the database. Returns "True" if user is there. Else, returns "False"
async function search(searchParameters){
    var email = searchParameters.email;

    var doesExist = await new Promise((resolve, reject) => {
        admin.auth().getUserByEmail(email)
        .then(async (userCredentials) => {
            var userRecord = userCredentials.toJSON();
            var uid = userRecord.uid;
            var accountType = await getAccountType(uid);
            userRecord["metadata"]["lastSignInTime"] = new Date().toString();
            userRecord["Account Type"] = accountType;
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
async function isValidated(uid, response){
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

//get account type of user with given uid
async function getAccountType(uid){
    var accountType = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).on('value', (snapshot) => {
            var value = snapshot.val();
            if (value == null){
                resolve("N/A");
            }
            else{
                var accountType = value["accountType"];
                resolve(accountType);
            }
        })
    })

    return accountType;

}

//login user
async function login(userParameters, response){
    var userRecord = await search(userParameters);
    if (userRecord == "N/A"){
        var responseContent = "false";
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write(responseContent);
        response.end();
    }
    else{
        response.writeHead(200, { "Content-type": "application/json" });
        response.write(JSON.stringify(userRecord));
        response.end();
    }
}

module.exports = {
    register: register,
    search: search,
    isValidated: isValidated,
    getAccountType: getAccountType,
    login: login
}