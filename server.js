//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const lookup = require("mime-types").lookup;
var CryptoJS = require("crypto-js");
const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref("/users/");

const SMTP = require("./public/SMTP");
const GoogleAuth = require("./public/GoogleAuth")
const firebaseAPI = require("./public/FirebaseAPI");


function issueServerResponse(path, request, response){
    console.log(`Requested Path: ${path}`);

    var file = "";
    switch(path){
        case "/":
            file = __dirname + "/public/user-auth-form.html";
            break;
        case "/placeholders/homepage.html":
            file = __dirname + "/placeholders/homepage.html";
            break;

        case "/user-registration-form.css":
            file = __dirname + "/public/user-registration-form.css";
            break;

        case "/user-registration-form.html":
            file = __dirname + "/public/user-registration-form.html";
            break;

        case "/user-auth-form.css":
            file = __dirname + "/public/user-auth-form.css";
            break;
        case "/img/pharmacy.jpg":
            file = __dirname + "/img/pharmacy.jpg";
            break;
        case "/favicon.ico":
            file = __dirname + "/img/favicon.ico";
            break;
        
        case "/credentials/google":
           GoogleAuth.retrieveClientCredentials(response);
           break;
        
        case "/authenticate/google":
            GoogleAuth.authenticateViaGoogle(request, response);            
            break;
        
        case "/register":
            var credentials = "";

            request.on('data', (data) => {
                credentials += data;
            });

            request.on('end', async () => {
                credentials = JSON.parse(credentials);
                var email = credentials.email
                await SMTP.sendValidationEmail(email);
                var userParameters = {email: email, emailVerified: false, password: "random", displayName: "First Last", photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", disabled: true}
                await firebaseAPI.createUser(userParameters, response);
            })
            break;
        
        case "/completeValidation":
            //Complete the validation of an email
            file = __dirname + "/public/email-verified.html";
            break;
        
        case "/complete-validation.html":
            file = __dirname + "/public/complete-validation.html";
            break;
        
        case "/validate/user":
            var credentials = "";

            request.on('data', (data) => {
                credentials += data;
            });

            request.on('end', async () => {
                credentials = JSON.parse(credentials);
                var uid = credentials.uid;

                await admin.auth().updateUser(uid, {emailVerified: true, disabled: false})
                await ref.child(`${uid}`).update({emailVerified: true})

                response.writeHead(200, { "Content-type": "text/plain" });
                response.write("Done!");
                response.end();
            })
            break;
        
        case "/checkUserValidation":
            var credentials = "";

            request.on('data', (data) => {
                credentials += data;
            });


            request.on('end', () => {
                credentials = JSON.parse(credentials);
                var uid = credentials.uid;
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
            })
            break;
        
        case "/login":
            var credentials = "";

            request.on('data', (data) => {
                credentials += data;
            });


            request.on('end', () => {
                credentials = JSON.parse(credentials);
                var email = credentials["email"];
                var password = credentials["password"];

                admin.auth().getUserByEmail(email).then(userCredentials => {
                    var userRecord = userCredentials.toJSON();
                    response.writeHead(200, { "Content-type": "application/json" });
                    response.write(JSON.stringify(userRecord));
                    response.end();
                })
                .catch(err => {
                    if (err.code == "auth/user-not-found"){
                        var userRecord = {uid: "ERROR"};
                        response.writeHead(400, { "Content-type": "application/json" });
                        response.write(JSON.stringify(userRecord));
                        response.end();
                    }
                })
            })
            break;
            
    }

    if (file == ""){
        // If client is not requesting a file, they are simply requesting for data. Handle that HERE
        console.log("Response sent");
    }
    else{
        //Client is requesting a file
        fs.readFile(file, function(err, content){
            if (err){
                console.log(`File Not Found ${file}`);
                response.writeHead(404);
                response.end()
            }
            else{
                let mime = lookup(file);
                response.writeHead(200, { "Content-type": mime });
                response.write(content);
                response.end();
            }
        })
    }
}

const server = http.createServer((request, response) => {
    //Handle client requests and issue server response here 
    let path = url.parse(request.url, true).path;
    issueServerResponse(path, request, response);
    
})


server.listen(8000, "localhost", () => {
    console.log("Spun up Node.js server running locally on port 8000")
})

