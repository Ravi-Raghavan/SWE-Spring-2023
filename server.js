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
        case "/homepage.html":
            file = __dirname + "/public/homepage.html";
            break;
        
        case "/nav.css":
            file = __dirname + "/public/nav.css";
            break;
        
        case "/main.css":
            file = __dirname + "/public/main.css";
            break;
        
        case "/img/top_logo.png":
            file = __dirname + "/img/top_logo.png";
            break;

        case "/img/tablets.png":
            file = __dirname + "/img/tablets.png";
            break;
        
        case "/img/tablets_3.png":
            file = __dirname + "/img/tablets_3.png";
            break;
        
        case "/img/tablets_2.png":
            file = __dirname + "/img/tablets_2.png";
            break;
        
        case "/img/protein_powder.png":
            file = __dirname + "/img/protein_powder.png";
            break;
        
        case "/img/protein_powder_2.png":
            file = __dirname + "/img/protein_powder_2.png";
            break;
        
        case "/img/mayank_profile.png":
            file = __dirname + "/img/mayank_profile.png";
            break;
        
        case "/img/logo.png":
            file = __dirname + "/img/logo.png";
            break;
        
        case "/img/jeff_profile.png":
            file = __dirname + "/img/jeff_profile.png";
            break;
        
        case "/img/insulin_meter.png":
            file = __dirname + "/img/insulin_meter.png";
            break;
        
        case "/img/bottom_logo.png":
            file = __dirname + "/img/bottom_logo.png";
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
        
        case "/validateEmail":
            //Complete the validation of an email
            file = __dirname + "/public/email-validated.html";
            break;
        
        case "/waiting-for-validation.html":
            file = __dirname + "/public/waiting-for-validation.html";
            break;
        
        case "/SWEIndex.html":
            file = __dirname + "/public/SWEIndex.html";
            break;
        
        case "/SWEStyle.css":
            file = __dirname + "/public/SWEStyle.css"
            break;
        
        case "/img/DHTransparentPill.png":
            file = __dirname + "/img/DHTransparentPill.png";
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


            request.on('end', async () => {
                credentials = JSON.parse(credentials);
                var uid = credentials.uid;
                await firebaseAPI.checkUserValidation(uid, response);
            })
            break;
        
        case "/login":
            var credentials = "";

            request.on('data', (data) => {
                credentials += data;
            });


            request.on('end', async () => {
                credentials = JSON.parse(credentials);
                var email = credentials["email"];
                var password = credentials["password"];
                var searchParameters = {email: email};
                await firebaseAPI.loginUser(searchParameters, response);
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

