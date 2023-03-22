//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const lookup = require("mime-types").lookup;
var CryptoJS = require("crypto-js");
const admin = require("./js/firebase").admin;
var natural = require("natural");
var db = admin.database();
var ref = db.ref("/users/");
var FAQ_ref = db.ref("/FAQ/");

const paypal = require("./js/paypal.js");
const SERP = require("./js/SERP");
const SMTP = require("./js//SMTP");
const GoogleAuth = require("./js/GoogleAuth");
const firebaseAPI = require("./js/FirebaseAPI");

const public_paths_html = [
  "/html/contact-us.html",
  "/html/dashboard.html",
  "/html/deliverypage.html",
  "/html/email-validated.html",
  "/html/FAQ.html",
  "/html/homepage.html",
  "/html/index.html",
  "/html/knowledge-base.html",
  "/html/logoutPage.html",
  "/html/PrescriptionRequest.html",
  "/html/storage.html",
  "/html/user-auth-form.html",
  "/html/user-registration-form.html",
  "/html/waiting-for-validation.html",
  "/html/store.html",
  "/html/submitted-prescription-patient-wait.html",
  "/html/submitted-prescription-patient-validated.html",
  "/html/submitted-prescription-doctor-wait.html",
  "/html/submitted-prescription-doctor-validated.html",
  "/html/header.html",
  "/html/footer.html",
];

// const public_paths_php = [
//   "/html/header.php"
// ]

const public_paths_css = [
  "/css/static.css",
  "/css/contact-us.css",
  "/css/darkmode.css",
  "/css/dashboard.css",
  "/css/deliverypage.css",
  "/css/dynamic-size.css",
  "/css/email-validated.css",
  "/css/FAQ.css",
  "/css/homepage.css",
  "/css/homepage-footer.css",
  "/css/homepage-nav.css",
  "/css/knowledge-base.css",
  "/css/logout.css",
  "/css/Prescription.css",
  "/css/store.css",
  "/css/user-auth-form.css",
  "/css/user-registration-form.css",
  "/css/waiting-for-validation.css",
];

const public_paths_js = [
  "/js/darkmode.js",
  "/js/dashboard-view.js",
  "/js/script.js",
  "/js/paypal.js",
  "/js/firebase.js",
  "/js/FirebaseAPI.js",
  "/js/GoogleAuth.js",
  "/js/GoogleAuthCredentials.js",
  "/js/NLP 2.0.js",
  "/js/orderController.js",
  "/js/orderModel.js",
  "/js/orders.js",
  "/js/productController.js",
  "/js/productModel.js",
  "/js/SERP.js",
  "/js/SMTP.js",
  "/js/store.js",
  "/js/util.js",
  "/js/prescription.js",
  "/js/dynamicHeaderFooter.js",
  "/js/contact-us-view.js",
  "/js/scroller.js",
  "/js/reviewScroller.js",
  "/js/homepage.js",
  "/js/imagePreloader.js",
  "/js/testModel.js",
  "/js/testController.js",
  "/js/prescriptionModel.js",
  "/js/prescriptonController.js",
  "/js/FAQ-view.js",
];

const public_paths_images = [
  "/favicon.ico",
  "/images/profile.jpg",
  "/images/top_logo.png",
  "/images/bottom_logo.png",
  "/images/moon.png",
  "/images/tablets.png",
  "/images/tablets_2.png",
  "/images/protien_powder.png",
  "/images/tablets_3.png",
  "/images/mayank_profile.png",
  "/images/protien_powder_2.png",
  "/images/insulin_meter.png",
  "/images/jeff_profile.png",
  "/images/baby.png",
  "/images/apple.png",
  "/images/family.png",
  "/images/house.png",
  "/images/fitness.png",
  "/images/link.png",
  "/images/abid_img.png",
  "/images/twitter.png",
  "/images/insta.png",
  "/images/facebook.png",
  "/images/profile.png",
  "/images/profile.jpg",
  "/images/doctor.png",
  "/images/knowledge_background.jpg",
  "/images/Ibuprofen.jpg",
  "/images/Codeine.jpg",
  "/images/Oxycotin.jpg",
  "/images/background.jpg",
  "/images/leftArrow.png",
  "/images/rightArrow.png",
  "/images/medicine_wallpaper.jpg",
  "/images/Map_Place_Holder.png",
  "/images/bbbg.jpg",
  "/images/pharmacy.jpg",
  "/images/snapchat.png",
  "/images/reddit.png",
  "/images/redx.png",
  "/images/quadis_img.png",
  "/images/kristina_img.png",
  "/images/DHLogo2Transp.png"
];

const public_paths_product = [
  "/product/2CB.jpeg",
  "/product/Ashwagandha.jpg",
  "/product/Aspirin.jpg",
  "/product/DMT.webp",
  "/product/cocaine.jpg",
  "/product/creatine.webp",
  "/product/Ecstasy.jpg",
  "/product/Fentanyl.jpg",
  "/product/heroin.webp",
  "/product/Ibuprofen.jpg",
  "/product/ketaset.png",
  "/product/Losartan.jpeg",
  "/product/LSD.jpg",
  "/product/Marijuana.jpg",
  "/product/Meth.jpg",
  "/product/Morphine.jpg",
  "/product/Naproxen.jpg",
  "/product/opium.jpeg",
  "/product/Pantoprazole.jpeg",
  "/product/PCP.jpg",
  "/product/polyjuice.webp",
  "/product/Rohypnol.jpg",
  "/product/steroids.jpeg",
  "/product/tigerBalm.jpg",
  "/product/whey_protien.jpeg",
  "/product/polyJuice.webp",
  "/product/Benzodiazepines.webp",
  "/product/Adderall.jpg",
  "/product/GHB.jpg",
  "/product/Tobacco.webp",
  "/product/salvia.jpg",
];

const { createProduct } = require("./js/productController");
const { testCreateOrder, updateOrder, createOrder, updateCart } = require("./js/orderController");
const { createMyMessageProcess } = require("./js/testController");
const { createPatientPrescriptionProcess, createDoctorPrescriptionProcess, getAccountTypeForPPProcess, getDoctorPrescriptionsProcess, createValidatedPrescriptionProcess, getPatientPrescriptionsProcess, deletePatientPrescriptionProcess, deleteDoctorPrescriptionProcess } = require("./js/prescriptionController");
const { createDoctorPrescription, createValidatedPrescription, deleteDoctorPrescription } = require("./js/prescriptionModel");
const FirebaseAPI = require("./js/FirebaseAPI");
const { getPostData } = require("./js/utils");
const { sendValidatedPrescriptionNotification } = require("./js//SMTP");

//const { createPatientPrescription } = require("./js/patientPrescriptionController");

function FAQ(request, response, queryStringParameters) {
  var searchQuery = "";

  request.on("data", (data) => {
    searchQuery += data;
  });

  request.on("end", async () => {
    searchQuery = queryStringParameters.query;
    var categoryClassifierFileName = "./json/CategoryBayesianClassifier.json";
    var intentClassifierFileName = "./json/IntentBayesianClassifier.json";
    natural.BayesClassifier.load(categoryClassifierFileName, null, function (err, categoryClassifier) {
      natural.BayesClassifier.load(intentClassifierFileName, null, function(err, intentClassifier){
        var category = categoryClassifier.classify(searchQuery);
        var intent = intentClassifier.classify(searchQuery);

        console.log("Category: " + category);
        console.log("Intent: " +  intent);

        db.ref(`/FAQ/${category}/${intent}/`).once("value", function (snapshot) {
          var value = snapshot.val()
          var results = []
          if (value != null){
            console.log("Valid Snapshot Returned");
            for (let key in value){
              results.push(value[key]);
            }
            console.log(results);
          }
          console.log("Search Results: " + JSON.stringify(results));
          response.writeHead(200, { "Content-type": "application/json" });
          response.write(JSON.stringify(results));
          response.end();
        });

      })
    });
  });
}

function getFAQ(request, response) {

  request.on("data", (data) => {

  });
  var results = [];
  request.on("end", async () => {

      FAQ_ref.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          childSnapshot.forEach(function(childChildSnapshot){
            childChildSnapshot.forEach(function(childChildChildSnapshot){
              results.push(childChildChildSnapshot.val())
            })
          })
        });

        console.log("Search Results: " + JSON.stringify(results));
        response.writeHead(200, { "Content-type": "application/json" });
        response.write(JSON.stringify(results));
        response.end();
      });
  });
}

function login(request, response, queryStringParameters) {
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var email = queryStringParameters["email"];
    var userParameters = { email: email };
    await firebaseAPI.login(userParameters, response);
  });
}
function register(request, response) {
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    var email = credentials.email;
    var accountType = credentials.accountType;

    await SMTP.sendValidationEmail(email);
    var userParameters = {
      accountType: accountType,
      email: email,
      emailVerified: false,
      password: "random",
      displayName: "First Last",
      photoURL:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      disabled: true,
    };
    await firebaseAPI.register(userParameters, response);
  });
}

function sendEmail(request, response, queryStringParameters) {
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var email = queryStringParameters.email;
    await SMTP.sendValidationEmail(email);
  });
  response.writeHead(200, { "Content-type": "text/plain" });
  response.write("Done!");
  response.end();
}

async function sendValidatedPrescriptionNotificationProcess(req,res,queryStringParameters){
  try{
    let body = await getPostData(req);
    const {doctorFirstName,doctorLastName,prescriptionNumber} = JSON.parse(body);
    var email = queryStringParameters.email;
    var notificationREF = await sendValidatedPrescriptionNotification(email,doctorFirstName,doctorLastName,prescriptionNumber);
    const dataToSend = {
      id: notificationREF
    };
    res.writeHead(200, {"Content-type": "application/json"});
    res.end(JSON.stringify(dataToSend));
  }catch (err){
    console.log(err);
  }
}

async function sendPatientActionRequiredProcess(req,res,queryStringParameters){
  try{
    let body = await getPostData(req);
    const {doctorFirstName,doctorLastName,prescriptionNumber} = JSON.parse(body);
    var email = queryStringParameters.email;
    var notificationREF = await sendValidatedPrescriptionNotification(email,doctorFirstName,doctorLastName,prescriptionNumber);
    const dataToSend = {
      id: notificationREF
    };
    res.writeHead(200, {"Content-type": "application/json"});
    res.end(JSON.stringify(dataToSend));
  }catch (err){
    console.log(err);
  }
}

function serveFileContent(file, response) {
  fs.readFile(file, function (err, content) {
    if (err) {
      console.log(`File Not Found ${file}`);
      response.writeHead(404);
      response.end();
    } else {
      let mime = lookup(file);
      response.writeHead(200, { "Content-type": mime });
      response.write(content);
      response.end();
    }
  });
}

function completeValidation(request, response) {
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    var uid = credentials.uid;

    await admin
      .auth()
      .updateUser(uid, { emailVerified: true, disabled: false });
    await ref.child(`${uid}`).update({ emailVerified: true });

    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("Done!");
    response.end();
  });
}

function checkValidation(request, response, queryStringParameters) {
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var uid = queryStringParameters.uid;
    await firebaseAPI.isValidated(uid, response);
  });
}

function knowledgeBaseSearch(request, response, queryStringParameters) {
  var credentials = "";
  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var query = queryStringParameters.query;
    var jsonString = await SERP.executeQuery(query);
    response.writeHead(200, { "Content-type": "application/json" });
    response.write(jsonString);
    response.end();
  });
}

function updateUser(request, response){
  var credentials = "";
  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    await firebaseAPI.updateUser(credentials, response);
  });
}

function sendContactEmail(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    await SMTP.sendContactEmail(credentials);
  });

  response.writeHead(200, { "Content-type": "text/plain" });
  response.write("Done!");
  response.end();
}

function getPrescriptionsUser(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    await FirebaseAPI.getPrescriptionsUser(credentials.uid, response);
  });
}

function addPaymentCard(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    await FirebaseAPI.addPaymentCard(credentials, response);
  });
}

function getPaymentCards(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getPaymentCards(queryStringParameters, response);
  });
}

function deletePaymentCard(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.deletePaymentCard(queryStringParameters, response);
  });
}

function deleteAccount(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.deleteUserAccount(queryStringParameters, response);
  });
}

function parseQueryStringParameters(queryString) {
  var queryStringParameters = {};
  var tokenizedQueryString = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

  for (var i = 0; i < tokenizedQueryString.length; i++) {
      var token = tokenizedQueryString[i].split('=');
      queryStringParameters[decodeURIComponent(token[0])] = decodeURIComponent(token[1] || '');
  }
  return queryStringParameters;
}

function getUserCart(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getUserCart(queryStringParameters, response);
  });
}

const server = http.createServer((request, response) => {
  //   //Handle client requests and issue server response here
  let path = url.parse(request.url, true).path;
  // console.log(`Requested Path: ${path}`);
  var file = "";
  path = path == "/" ? "/html/homepage.html" : path;

  if (
    public_paths_html.includes(path) ||
    public_paths_css.includes(path) ||
    public_paths_js.includes(path) ||
    public_paths_images.includes(path) ||
    public_paths_product.includes(path)
  ) {
    file = __dirname + path;
  } else if (public_paths_html.includes("/html" + path)) {
    file = __dirname + "/html" + path;
  } else if (public_paths_html.includes("/css" + path)) {
    file = __dirname + "/css" + path;
  } else if (public_paths_html.includes("/js" + path)) {
    file = __dirname + "/js" + path;
  } else if (public_paths_html.includes("/images" + path)) {
    file = __dirname + "/images" + path;
  } else {
    console.log(path);
    console.log(file);
  }

  if (file == "") {
    // If client is not requesting a file, they are simply requesting for data. Handle that HERE

    //Strip Query String Parameteres
    var questionMarkIndex = path.indexOf("?");
    var queryStringParameters = "";

    if (questionMarkIndex != -1){
      queryStringParameters = parseQueryStringParameters(path.substring(questionMarkIndex));
      console.log(JSON.stringify(queryStringParameters));
      path = path.substring(0, questionMarkIndex);
    }


    switch (path) {
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
        login(request, response, queryStringParameters);
        break;

      case "/login/google":
        GoogleAuth.login(request, response, queryStringParameters);
        break;

      case "/validate/user":
        completeValidation(request, response);
        break;

      case "/fetch/user/validation":
        checkValidation(request, response, queryStringParameters);
        break;

      case "/send/email":
        sendEmail(request, response, queryStringParameters);
        break;

      case "/send/validationEmail":
        sendValidatedPrescriptionNotificationProcess(request,response,queryStringParameters);
        break;

      case "/send/patientActionRequired":
        sendPatientActionRequiredProcess(request,response,queryStringParameters);
        break;

      case "/knowledgebase/search":
        knowledgeBaseSearch(request, response, queryStringParameters);
        break;

      case "/faq/search":
        FAQ(request, response, queryStringParameters);
        break;

      case "/faq/articles":
        getFAQ(request, response);
        break;

      case "/api/products":
        createProduct(request, response);
        break;

      case "/test/createOrder":
        testCreateOrder(request, response);
        break;

      case "/api/updateCart":
        console.log("updating the total cost: /api/updateCost");
        updateCart(request, response);
        break;

      case "/testMake":
        createMyMessageProcess(request, response);
        break;

      case "/update/user":
        updateUser(request, response);
        break;

      case "/make/patientPrescription":
        createPatientPrescriptionProcess(request,response);
        break;

      case "/make/doctorPrescription":
        createDoctorPrescriptionProcess(request,response);
        break;

      case "/prescription/accountType":
        getAccountTypeForPPProcess(request,response);
        break;

      case "/contact-us":
        sendContactEmail(request, response);
        break;

      case "/prescriptions/getDoctorList":
        getDoctorPrescriptionsProcess(request,response);
        break;

      case "/prescriptions/getPatientList":
        getPatientPrescriptionsProcess(request,response);
        break;

      case "/make/validatedPrescription":
        createValidatedPrescriptionProcess(request,response);
        break;

      case "/get/prescriptions/user":
        getPrescriptionsUser(request, response);
        break;

      case "/add/payment_card":
        addPaymentCard(request, response);
        break;

      case "/get/payment_cards":
        getPaymentCards(request, response, queryStringParameters);
        break;

      case "/delete/payment_card":
        deletePaymentCard(request, response, queryStringParameters);
        break;

      case "/delete/patientPrescription":
        deletePatientPrescriptionProcess(request,response);
        break;  

      case "/delete/doctorPrescription":
        deleteDoctorPrescriptionProcess(request,response);
        break;
        
      case "/delete/account":
        deleteAccount(request, response, queryStringParameters);
        break;

      case "/get/cart":
        getUserCart(request, response, queryStringParameters);
        break;
    }
  }

  else {
    //Client is requesting a file
    console.log("Serving File Content: " + file);
    serveFileContent(file, response);
  }

  let reqUrl =
    url.parse(request.url).pathname == "/"
      ? "index.html"
      : url.parse(request.url).pathname;
  let captureUrl = reqUrl.match(/^\/api\/orders\/([^\/]+)\/capture$/);

  if (reqUrl === "/api/orders" && request.method == "POST") {
    var credentials = "";

    request.on("data", (data) => {
      credentials += data;
    });

    request.on("end", async () => {
      var uid = JSON.parse(credentials).uid;
      console.log("User's UID: ", uid);
      paypal
      .createOrder(uid)
      .then((order) => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(order));
      })
      .catch((error) => {
        response.statusCode = 500;
        response.setHeader("Content-Type", "text/plain");
        response.end(`Error creating order: ${error}`);
      });
    });


  } else if (
    captureUrl != null &&
    reqUrl === captureUrl[0] &&
    request.method == "POST"
  ) {
    const orderId = captureUrl[1];
    console.log(orderId);
    paypal
      .capturePayment(orderId)
      .then((data) => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(data));
      })
      .catch((error) => {
        response.statusCode = 500;
        response.setHeader("Content-Type", "text/plain");
        response.end(`Error creating order: ${error}`);
      });
  }
});

server.listen(8000, "localhost", () => {
  console.log("Spun up Node.js server running locally on port 8000");
});
