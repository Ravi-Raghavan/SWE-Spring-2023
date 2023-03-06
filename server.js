//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const lookup = require("mime-types").lookup;
var CryptoJS = require("crypto-js");
const admin = require("./firebase").admin;
var natural = require('natural');
var db = admin.database();
var ref = db.ref("/users/");
var FAQ_ref = db.ref("/FAQ/");

const paypal = require("./public/OrderProcessing/PayPal/paypal.js");

const SERP = require("./public/SERP");
const SMTP = require("./public/SMTP");
const GoogleAuth = require("./public/GoogleAuth")
const firebaseAPI = require("./public/FirebaseAPI");
const public_paths = ["/homepage.html", "/homepage.css", "/homepage-nav.css", "/homepage-footer.css", "/user-registration-form.html",  "/user-registration-form.css", "/user-auth-form.css", "/dashboard.css",
                    "/waiting-for-validation.html", "/waiting-for-validation.css", "/email-validated.css", "/user-auth-form.html", "/email-validated.html", "/SMTP.js",
                    "/knowledge-base.html", "/knowledge-base.css", "/FAQ.html", "/FAQ.css", "/PrescriptionRequest.html", "/logoutPage.html", "/darkpan-1.0.0/index.html", "/OrderProcessing/Cart/store.html", "/dashboard.html",
                    "/OrderProcessing/Cart/store.js", "/OrderProcessing/Cart/style.css", "/dynamic-size.css", "/contact-us.html", "/contact-us.css", "/deliverypage.html", "/deliverypage.css"]
const img_paths = ["/img/protien_powder_2.png", "/img/top_logo.png", "/img/tablets.png", "/img/tablets_3.png", "/img/tablets_2.png", "/img/protein_powder.png",
                    "/img/protein_powder_2.png", "/img/mayank_profile.png", "/img/logo.png", "/img/jeff_profile.png", "/img/insulin_meter.png", "/img/bottom_logo.png",
                    "/img/pharmacy.jpg","/img/DHTransparentPill.png", "/img/favicon.ico", "/img/profile.png", "/img/profile.png", "/img/background.jpg", "/img/img_avatar.png",
                    "/img/no_thumbnail.jpg", "/img/Codeine.jpg", "/img/Ibuprophen.jpg", "/img/Oxycotin.jpg", "/img/Map_Place_Holder.png"];

const { createProduct } = require("./OrderProcessing/Products/productController");

function binarySearch(list, target){
    var lo = 0;
    var hi = list.length - 1;

    while (lo <= hi){
        var mid = Math.floor((lo + hi) / 2);

        if (list[mid] == target){
            return mid;
        }

        else if (list[mid] < target){
            lo = mid + 1;
        }
        else{
            hi = mid - 1;
        }
    }

    if (lo < 0){lo = 0;}
    else if (lo > list.length - 1){lo = list.length - 1;}

    if (lo > 0 && lo < list.length - 1){
        let distanceA = natural.LevenshteinDistance(list[lo - 1], target);
        let distanceB = natural.LevenshteinDistance(list[lo], target);
        let distanceC = natural.LevenshteinDistance(list[lo + 1], target);

        if (distanceA < distanceB && distanceA < distanceC){
            return lo - 1;
        }

        if (distanceB < distanceA && distanceB < distanceC){
            return lo;
        }

        if (distanceC < distanceB && distanceC < distanceA){
            return lo + 1;
        }
    }
    else if (lo == 0 && lo + 1 <= list.length - 1){
        let distanceA = natural.LevenshteinDistance(list[lo], target);
        let distanceB = natural.LevenshteinDistance(list[lo + 1], target);

        if (distanceA < distanceB){
            return lo;
        }

        if (distanceB < distanceA){
            return lo + 1;
        }
    }
    else if (lo == list.length - 1 && lo - 1 >= 0){
        let distanceA = natural.LevenshteinDistance(list[lo], target);
        let distanceB = natural.LevenshteinDistance(list[lo - 1], target);

        if (distanceA < distanceB){
            return lo;
        }

        if (distanceB < distanceA){
            return lo - 1;
        }
    }


    return lo;
}


function FAQ(request, response){
    var searchQuery = "";

    request.on('data', (data) => {
        searchQuery += data;
    });

    request.on('end', async () => {
        var stemmedTokensSearchQuery = natural.PorterStemmer.tokenizeAndStem(searchQuery).sort();
        var fileName = "./test/BayesianClassifier.json";
        natural.BayesClassifier.load(fileName, null, function(err, classifier) {
            var category = classifier.classify(searchQuery);
            console.log("Category: " + category);
            var results = []
            FAQ_ref.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                  var childKey = childSnapshot.key;
                  var childData = childSnapshot.val();
                  var topicList = childData.topics;
                  var articleTitle = childData.title;

                  if (topicList.includes(category)){
                    var stemmedTokensArticle = natural.PorterStemmer.tokenizeAndStem(articleTitle).sort();
                    console.log("Stemmed Tokens for Query: " + stemmedTokensSearchQuery);
                    console.log("Stemmed Tokens for Article: " + stemmedTokensArticle);
                    var similarity = 0;

                    stemmedTokensSearchQuery.forEach((term) => {
                        var index = binarySearch(stemmedTokensArticle, term);
                        console.log("Term: " + term);
                        console.log("Index: " + index);
                        similarity = similarity + natural.LevenshteinDistance(stemmedTokensArticle[index], term)
                    })

                    console.log("Levenshtein Distance: " + similarity);

                    if (similarity <= 15){
                        results.push(childData);
                    }
                  }
                });

                console.log("Search Results: " + JSON.stringify(results));
                response.writeHead(200, { "Content-type": "application/json" });
                response.write(JSON.stringify(results));
                response.end();
              });
        });
    })
}

function login(request, response){
    var credentials = "";

    request.on('data', (data) => {
        credentials += data;
    });


    request.on('end', async () => {
        credentials = JSON.parse(credentials);
        var email = credentials["email"];
        var userParameters = {email: email};
        await firebaseAPI.login(userParameters, response);
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
        var accountType = credentials.accountType;

        await SMTP.sendValidationEmail(email);
        var userParameters = {accountType: accountType, email: email, emailVerified: false, password: "random", displayName: "First Last", photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", disabled: true}
        await firebaseAPI.register(userParameters, response);
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
        await firebaseAPI.isValidated(uid, response);
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

    if (public_paths.includes(path) || path.includes("FAQ") || path.includes("darkpan") || path.includes("darkmode")){
        file = __dirname + "/public" + path;
    }
    else if(path.includes("/img")){
        file = __dirname +  path;
    }
    else if (path.includes("font-awesome-4.7.0")){
        file = __dirname + "/public" + path;
    }
    else if (path.includes("/OrderProcessing")){
        file = __dirname + "/public" + path;
    }

    if (file == ""){
        // If client is not requesting a file, they are simply requesting for data. Handle that HERE
        switch(path){
            case "/credentials/google":
               GoogleAuth.retrieveClientCredentials(response);
               break;

            case "/register":
                register(request, response);
                break;

            case "/register/google":
                GoogleAuth.register(request, response);
                break;

            case "/login":
                login(request, response);
                break;

            case "/login/google":
                GoogleAuth.login(request, response);
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

            case "/faq/search":
                FAQ(request, response);
                break;

            case "/api/products":
                createProduct(request, response);
                break;
        }
    }
    else{
        //Client is requesting a file
        console.log("Serving File Content: " + file);
        serveFileContent(file, response);
    }

    let reqUrl = url.parse(request.url).pathname == "/" ? "index.html" : url.parse(request.url).pathname;
    let captureUrl = reqUrl.match(/^\/api\/orders\/([^\/]+)\/capture$/);

    if (reqUrl === "/api/orders" && request.method == "POST") {
        paypal.createOrder()
            .then(order => {
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(order));
            })
            .catch(error => {
                response.statusCode = 500;
                response.setHeader("Content-Type", "text/plain");
                response.end(`Error creating order: ${error}`);
            });
    } else if (captureUrl != null && reqUrl === captureUrl[0] && request.method == "POST") {
        const orderId = captureUrl[1];
        console.log(orderId);
        paypal.capturePayment(orderId)
            .then(data => {
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(data));
            })
            .catch(error => {
                response.statusCode = 500;
                response.setHeader("Content-Type", "text/plain");
                response.end(`Error creating order: ${error}`);
            });
    }
})


server.listen(8000, "localhost", () => {
    console.log("Spun up Node.js server running locally on port 8000")
})

