//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const lookup = require("mime-types").lookup;
var CryptoJS = require("crypto-js");
const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref("/users/");

const SERP = require("./public/SERP");
const SMTP = require("./public/SMTP");
const GoogleAuth = require("./public/GoogleAuth")
const firebaseAPI = require("./public/FirebaseAPI");
const public_paths = ["/homepage.html", "/homepage.css", "/homepage-nav.css", "/homepage-footer.css", "/user-registration-form.html",  "/user-registration-form.css", "/user-auth-form.css", 
                    "/waiting-for-validation.html", "/waiting-for-validation.css", "/email-validated.css", "/user-auth-form.html", "/email-validated.html", "/SMTP.js",
                    "/knowledge-base.html", "/knowledge-base.css"]
const img_paths = ["/img/protien_powder_2.png", "/img/top_logo.png", "/img/tablets.png", "/img/tablets_3.png", "/img/tablets_2.png", "/img/protein_powder.png",
                    "/img/protein_powder_2.png", "/img/mayank_profile.png", "/img/logo.png", "/img/jeff_profile.png", "/img/insulin_meter.png", "/img/bottom_logo.png",
                    "/img/pharmacy.jpg","/img/DHTransparentPill.png", "/img/favicon.ico", "/img/profile.png", "/img/profile.png", "/img/background.jpg", "/img/img_avatar.png",
                    "/img/no_thumbnail.jpg"];

function login(request, response){
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
}
function register(request, response){
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
}

function sendEmail(request, response){
    var credentials = "";
    request.on('data', (data) => {credentials += data;});
    request.on('end', async () => {
        credentials = JSON.parse(credentials);
        var email = credentials.email;
        await SMTP.sendValidationEmail(email);
    })
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("Done!");
    response.end();
}

function serveFileContent(file, response){
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

function completeValidation(request, response){
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
}

function checkValidation(request, response){
    var credentials = "";
    
    request.on('data', (data) => {
        credentials += data;
    });

    request.on('end', async () => {
        credentials = JSON.parse(credentials);
        var uid = credentials.uid;
        await firebaseAPI.checkUserValidation(uid, response);
    })
}

function knowledgeBaseSearch(request, response){
    var credentials = "";
    request.on('data', (data) => {
        credentials += data;
    });

    request.on('end', async () => {
        credentials = JSON.parse(credentials);
        var query = credentials.query;
        var jsonString = await SERP.executeQuery(query);
        response.writeHead(200, { "Content-type": "application/json" });
        response.write(jsonString);
        response.end();
    })
}

const server = http.createServer((request, response) => {
    //Handle client requests and issue server response here 
    let path = url.parse(request.url, true).path;
    console.log(`Requested Path: ${path}`);
    var file = "";
    path = path == "/" ? "/homepage.html" : path
    path = path == "/favicon.ico" ? "/img/favicon.ico" : path

    if (public_paths.includes(path)){
        file = __dirname + "/public" + path;
    }
    else if(path.includes("/img")){
        file = __dirname +  path;
    }
    else if (path.includes("font-awesome-4.7.0")){
        file = __dirname + "/public" + path;
    }

    if (file == ""){
        // If client is not requesting a file, they are simply requesting for data. Handle that HERE
        switch(path){
            case "/credentials/google":
               GoogleAuth.retrieveClientCredentials(response);
               break;
            
            case "/authenticate/google":
                GoogleAuth.authenticateViaGoogle(request, response);            
                break;
            
            case "/register":
                register(request, response);
                break;
            
            case "/login":
                login(request, response);
                break;
            
            case "/validate/user":
                completeValidation(request, response);
                break;
            
            case "/fetch/user/validation":
                checkValidation(request, response);
                break;  
            
            case "/send/email":
                sendEmail(request, response);
                break;
            
            case "/knowledgebase/search":
                knowledgeBaseSearch(request, response);
                break;
        }
    }
    else{
        //Client is requesting a file
        console.log("Serving File Content");
        serveFileContent(file, response);
    }
})


server.listen(8000, "localhost", () => {
    console.log("Spun up Node.js server running locally on port 8000")
})

