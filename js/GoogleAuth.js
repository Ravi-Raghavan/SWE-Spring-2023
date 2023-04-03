//import libraries
var google_client_credentials =  require("./GoogleAuthCredentials").clientCredentials;
var CryptoJS = require("crypto-js");
const jwt_decode = require('jwt-decode');
const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref("/users/");
var firebaseAPI = require("./FirebaseAPI")

function retrieveClientCredentials(response){
    var encryptedClientID = CryptoJS.AES.encrypt(google_client_credentials.web.client_id, "SWE-Spring-2023").toString();
    var responseContent = {client_id: encryptedClientID}
    response.writeHead(200, { "Content-type": "application/json" });
    response.write(JSON.stringify(responseContent));
    response.end();
}

function register(request, response){
    var credentials = "";

    request.on('data', (data) => {
        credentials += data;
    });

    request.on('end', async () => {
        credentials = JSON.parse(credentials);
        var decryptedToken = jwt_decode(credentials["JWT"]);
        var email = decryptedToken.email;
        var accountType = credentials.accountType;
/*
        if (accountType == "Admin" && email != "swespring2023@gmail.com"){
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write(`Cannot create another admin account!`);
            response.end();
            return;
        }*/

        var userParameters = {accountType: accountType, email: email, emailVerified: true, password: "Google-OAuth", displayName: decryptedToken.name, photoURL: decryptedToken.picture, disabled: false}
        await firebaseAPI.register(userParameters, response);
    })
}


function login(request, response, queryStringParameters){
    var credentials = "";

    request.on('data', (data) => {
        credentials += data;
    });

    request.on('end', async () => {
        var decryptedToken = jwt_decode(queryStringParameters["JWT"]);
        var email = decryptedToken.email;

        var userParameters = {email: email};
        var userRecord = await firebaseAPI.search(userParameters);

        if (userRecord == "N/A"){
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write(`Account associated with ${email} doesn't exist!`);
            response.end();
        }
        else{
            userRecord = JSON.parse(userRecord);
            var currentDateTime = new Date().toString();
            userRecord["metadata"]["lastSignInTime"] = currentDateTime;
            userRecord["metadata"]["lastRefreshTime"] = currentDateTime;
            userRecord["tokensValidAfterTime"] = currentDateTime;

            console.log("==========USER RECORD ==============");
            console.log(userRecord);
            console.log("=========================");

            response.writeHead(200, { "Content-type": "text/plain" });
            response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
            response.end();
        }
        
    })
}

module.exports = {
    retrieveClientCredentials: retrieveClientCredentials,
    register: register, 
    login: login
}