//import libraries
var google_client_credentials =  require("./GoogleAuthCredentials").clientCredentials;
var CryptoJS = require("crypto-js");
const jwt_decode = require('jwt-decode');
const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref("/users/");


function retrieveClientCredentials(response){
    var encryptedClientID = CryptoJS.AES.encrypt(google_client_credentials.web.client_id, "SWE-Spring-2023").toString();
    var responseContent = {client_id: encryptedClientID}
    response.writeHead(200, { "Content-type": "application/json" });
    response.write(JSON.stringify(responseContent));
    response.end();
}

function authenticateViaGoogle(request, response){
    var credentials = "";

    request.on('data', (data) => {
        credentials += data;
    });

    request.on('end', () => {
        credentials = JSON.parse(credentials);
        var decryptedToken = jwt_decode(credentials["JWT"]);
        var email = decryptedToken.email;
                
        admin.auth().getUserByEmail(email).then((userCredentials) => {
            var userRecord = userCredentials.toJSON();
            console.log("User Record: " + JSON.stringify(userRecord));
            userRecord.metadata.lastSignInTime = new Date().toString();
            response.writeHead(200, { "Content-type": "text/plain" });
            response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
            response.end();
        })
        .catch(err => {
            if (err.code == 'auth/user-not-found'){
                admin.auth().createUser({
                    email: email,
                    emailVerified: true, 
                    password: "Google-OAuth",
                    displayName: decryptedToken.name,
                    photoURL: decryptedToken.picture,
                    disabled: false
                })
                .then((userCredentials) => {
                    var userRecord = userCredentials.toJSON();
                    console.log("User Record: " + JSON.stringify(userRecord));
                    response.writeHead(200, { "Content-type": "text/plain" });
                    response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
                    response.end();
                })
            }
        })
    })
}


module.exports = {
    retrieveClientCredentials: retrieveClientCredentials,
    authenticateViaGoogle: authenticateViaGoogle
}