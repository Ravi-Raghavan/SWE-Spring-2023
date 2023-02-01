//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const lookup = require("mime-types").lookup;
var google_auth =  require("./GoogleAuth").clientCredentials;
var CryptoJS = require("crypto-js");
const jwt_decode = require('jwt-decode');
const admin = require("./firebase").admin;
const nodemailer = require('nodemailer');

async function sendValidationEmail(email){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'swespring2023@gmail.com',
        pass: 'lotrlepvzmwdnsny'
    }
    });
    
    var mailOptions = {
        from: 'swespring2023@gmail.com',
        to: `${email}`,
        subject: 'Sending Email using Node.js',
        text: `Please Click the following link to complete the validation of your email: http://localhost:8000/completeValidation`
    };

    result = await new Promise((resolve, rejects) => {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                rejects(error);
            } else {
                resolve('Email sent: ' + info.response);
                console.log("Email Sent: " + info.response);
            }
        });
    })

    console.log("Done with sendValidationEmail()");
}

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
        
        case "/GoogleAuth":
            var encryptedClientID = CryptoJS.AES.encrypt(google_auth.web.client_id, "SWE-Spring-2023").toString();
            var responseContent = {client_id: encryptedClientID}
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(responseContent));
            response.end();
            break;
        
        case "/authenticate/google":
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

            break;
        
        case "/validate/email":
            var credentials = "";

            request.on('data', (data) => {
                credentials += data;
            });

            request.on('end', async () => {
                credentials = JSON.parse(credentials);
                var email = credentials.email
                await sendValidationEmail(email);
                response.writeHead(200, { "Content-type": "application/json" });
                response.write(JSON.stringify({emailStatus: "delivered"}));
                response.end();
            })
            break;
        
        case "/completeValidation":
            //Complete the validation of an email
            console.log("Almost there!");
            file = __dirname + "/public/complete-validation.html";
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

