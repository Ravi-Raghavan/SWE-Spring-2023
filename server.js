//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const lookup = require("mime-types").lookup;
var google_auth =  require("./GoogleAuth").clientCredentials;

function issueServerResponse(path, response){
    console.log(`Requested Path: ${path}`);

    var file = "";
    switch(path){
        case "/":
            file = __dirname + "/public/user-auth-form.html";
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
            var responseContent = {client_id: google_auth.web.client_id}
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(responseContent));
            response.end();
            break;
        
        case "/authenticate/google":
            var dummyJSON = {random: 24};
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(dummyJSON));
            response.end();
            break;
            
    }

    if (file == ""){
        // If client is not requesting a file, they are simply requesting for data. Handle that HERE
        console.log("Respone sent");
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
    issueServerResponse(path, response);
    
})


server.listen(8000, "localhost", () => {
    console.log("Spun up Node.js server running locally on port 8000")
})

