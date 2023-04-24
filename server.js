//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const formidable = require('formidable');
const bucket = require("./js/firebase").bucket;
const stream  = require('stream');

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
  "/html/deliveryTracking.html",
  "/html/email-validated.html",
  "/html/FAQ.html",
  "/html/fileUploadTest.html",
  "/html/ppview.html",
  "/html/dpview.html",
  "/html/homepage.html",
  "/html/requestPrescriptionNumberConfirmation.html",
  "/html/index.html",
  "/html/knowledge-base.html",
  "/html/logoutPage.html",
  "/html/newProductForm.html",
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
  "/html/subscriptions.html"
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
  "/css/ppview.css",
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
  "/css/subscriptions.css",
];

const public_paths_js = [
  "/js/darkmode.js",
  "/js/dashboard-view.js",
  "/js/ppview.js",
  "/js/dpview.js",
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
  "/js/profilePic.js",
  "/json/ProductsSold.json",
  "/js/subscriptions.js"
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
  "/images/DHLogo2Transp.png",
  "/images/ColorlessLogo.png",
  "/images/col1.png",
  "/images/col2.jpg",
  "/images/col3.jpg",
  "/images/subPage.jpg",
];

let public_paths_product = fs.readdirSync('./product').map(filename => `/product/${filename}`);

const { createProduct, receiveDrugFileImage, getProductByName, getTotalProductCount, getAllOTC, getAllPrescription} = require("./js/productController");
const { testCreateOrder, updateOrder, createOrder, updateCart } = require("./js/orderController");
const { createMyMessageProcess } = require("./js/testController");


const FirebaseAPI = require("./js/FirebaseAPI");
const { getPostData } = require("./js/utils");
const { sendValidatedPrescriptionNotification } = require("./js//SMTP");
const cloudStorage = require("./js/cloudStorage");
const {displayDoctorValidProcess, displayDoctorPendingProcess,doctorDropDownValidProcess,doctorDropDownProcess,recyclePrescriptionProcess,getPharamacyProcess,displayProcess,dropDownProcess,getDrugListProcess, getDrugsProcess,removeDoctorPrescriptionProcess,changeStatusProcess,validateProcess,getTypeProcess,addPatientPrescriptionProcess,addDoctorPrescriptionProcess,checkPrescriptionProcess, removePatientPrescriptionProcess, getRandomPrescriptionProcess } = require("./js/prescriptionController");
const { getRandomPrescription } = require("./js/prescriptionModel");

//const { createPatientPrescription } = require("./js/patientPrescriptionController");

async function refreshPathsProduct(req, res) {
  if(req.method !== 'PATCH') {
    res.writeHead(405, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({'405 Error Message': 'only PATCH is valid'}));
    return;
  }
  public_paths_product = fs.readdirSync('./product').map(filename => `/product/${filename}`);
  console.log('refresh success');
  res.end("images refreshed successfully");
}

async function FAQ(request, response, queryStringParameters) {
  var searchQuery = "";

  request.on("data", (data) => {
    searchQuery += data;
  });

  request.on("end", async () => {
    searchQuery = queryStringParameters.query;
    var categoryClassifierFileName = "./json/CategoryBayesianClassifier.json";
    var intentClassifierFileName = "./json/IntentBayesianClassifier.json";
    natural.BayesClassifier.load(categoryClassifierFileName, null, async function (err, categoryClassifier) {
      natural.BayesClassifier.load(intentClassifierFileName, null, async function(err, intentClassifier){
        var categoryClassifications = categoryClassifier.getClassifications(searchQuery);
        var intentClassifications = intentClassifier.getClassifications(searchQuery);

        console.log("Category Classifications: " + JSON.stringify(categoryClassifications));
        console.log("Intent Classifications: " + JSON.stringify(intentClassifications));

        var category = categoryClassifier.classify(searchQuery);
        var results = []

        for (let i = 0; i < intentClassifications.length; i ++){
          var intentClassification = intentClassifications[i];
          var intent = intentClassification["label"]

          let extractSubcategoryArticles = await db.ref(`/FAQ/${category}/${intent}/`).once("value");
          var value = extractSubcategoryArticles.val()

          console.log("Intent: " + intent);
          console.log("Extracted Subcategory Results: " + JSON.stringify(value));

          if (value != null){
            console.log("Valid Snapshot Returned");

            for (let key in value){
              console.log("Key: " + key + " Value: " + JSON.stringify(value[key]));
              results.push(value[key]);
            }
          }
        }

        if (results.length == 0){
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
        }
        else{
          console.log("Search Results: " + JSON.stringify(results));
          response.writeHead(200, { "Content-type": "application/json" });
          response.write(JSON.stringify(results));
          response.end();
        }
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

async function sendPrescriptionEmailProcess(req,res){
  try{
    let body = await getPostData(req);
    const {doctorEmail,prescriptionNumber} = JSON.parse(body);
    var notificationREF = await SMTP.sendPrescriptionEmail(doctorEmail,prescriptionNumber);
    const dataToSend = {
      id: notificationREF
    };
    res.writeHead(200, {"Content-type": "application/json"});
    res.end(JSON.stringify(dataToSend));
  }catch (err){
    console.log(err);
  }
}

async function sendReminderEmailProcess(req,res,queryStringParameters){
  try{
    let email = queryStringParameters.email;
    let pN = queryStringParameters.pN;
    let doctor = queryStringParameters.dfn +" " + queryStringParameters.dln;
    let medication = queryStringParameters.med;
    let refills = queryStringParameters.refills;
    let returnValue = await SMTP.sendReminderEmail(email,pN,doctor,medication,refills);
    if(returnValue == "error"){
      res.writeHead(400);
      res.end();
    }else{
      res.writeHead(200);
    res.end();
    }
  }catch (err){
    console.log(err);
  }
}

async function sendErrorEmailProcess(req,res){
  try{
    let body = await getPostData(req);
    const {prescriptionNumber,email,accountType} = JSON.parse(body);
    if(accountType=="PATIENT"){
      await SMTP.sendErrorEmailPatient(email,prescriptionNumber);
      res.writeHead(200);
      res.end();
    }else{
      await SMTP.sendErrorEmailDoctor(email,prescriptionNumber);
      res.writeHead(201);
      res.end();
    }
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

function getMedicationsUser(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getMedicationsUser(queryStringParameters["uid"], response);
  });
}

function getDrugData(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getDrugData(queryStringParameters["medicine"], response);
  });
}

function getPrescriptionsUser(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getPrescriptionsUser(queryStringParameters["uid"], response);
  });
}

function getOrdersUser(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getOrdersUser(queryStringParameters, response);
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
console.log("String Parameters:"+queryStringParameters)
  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getUserCart(queryStringParameters, response);
  });
}


function uploadDocumentation(request, response, queryStringParameters){
  const form = formidable({multiples: true})
  var uid = queryStringParameters.uid;

  form.parse(request, (err, fields, files) => {
    console.log("Fields: " + JSON.stringify(fields));
    if (err) {
      response.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      response.end(String(err));
      return;
    }

    var filePath = files["myfile"]["filepath"];
    var mimeType = files["myfile"]["mimetype"];
    var originalFileName = files["myfile"]["originalFilename"]
    var newFileName = files["myfile"]["newFilename"]

    fs.readFile(filePath, function (err, content) {
      if (err) {
        console.log(`File Not Found ${filePath}`);
      } else {
        console.log("Mime Type: " + mimeType);
        console.log("File Path: " + filePath);
        console.log("Original File Name: " + originalFileName);
        console.log("New File Name: " + newFileName);

        var userFile = `${uid}/${originalFileName}`;

        console.log("User File: " + userFile);

        bucket.file(userFile).save(content)
        .then(() => {
          var filesRef = ref.child(`${uid}/files`);
          filesRef.push().set({name: userFile, status: "unverified"})
          .then(() => {
            console.log("SUCCESS");
              response.writeHead(200, { "Content-type": "text/plain" });
              response.write("Successfully Uploaded File");
              response.end();
          })
          .catch((err) => {
              response.writeHead(404, { "Content-type": "text/plain" });
              response.write("Failed to Upload File");
              response.end();
          })
        })
        .catch((error) => {
            console.log("FAILURE");
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Couldn't Upload File");
            response.end();
        })
      }
    });
  })
}

function downloadOrders(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.downloadOrders(queryStringParameters, response);
  });
}

function downloadPrescriptions(request, response, queryStringParameters){
  var credentials = "";
  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.downloadPrescriptions(queryStringParameters, response);
  });
}

function getUserDocumentation(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getUserDocumentation(response);
  });
}

function updateDocumentationStatus(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials)
    await FirebaseAPI.updateDocumentationStatus(credentials, response);
  });

}

async function downloadUserFile(request, response, queryStringParameters) {

  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var file_name = queryStringParameters.file_name;

    console.log("FILE NAME: " + file_name);
    // Downloads the file into a buffer in memory.
    const contents = await bucket.file(file_name).download();
    console.log(contents[0]);
    response.writeHead(200, { "Content-type": "application/pdf", "Content-Length": contents[0].length, "Content-Disposition": `attachment; filename=${file_name}`});
    response.end(contents[0]);
  });
}


async function makeOrderReady(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var oid = JSON.parse(credentials).oid;
    var pid = JSON.parse(credentials).pid;
    await FirebaseAPI.markOrderReady(oid, pid, response);
  });

}

async function makeOrderClaimed(request, response, queryStringParameters){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    var oid = JSON.parse(credentials).oid;
    await FirebaseAPI.markOrderClaimed(oid, response);
  });

}

async function getReadyOrders(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getReadyOrders(response);
  });
}

async function getPharmacies(request, response){
  var credentials = "";

  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    await FirebaseAPI.getPharmacies(response);
  });
}

async function updateOrderLocation(request, response){
  var credentials = "";


  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    console.log(credentials)
    credentials = JSON.parse(credentials);
    console.log(credentials)
    var location = credentials.location;
    var OID = credentials.OID;
    console.log(OID);
    await FirebaseAPI.updateOrderLocation(location, OID, response);
  });
}

async function updateSubscriptionStatus(request, response){
  var credentials = "";


  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    var UID = credentials.UID;
    var subscription = {};
    try{
      subscription = await paypal.createSubscription();
      await FirebaseAPI.updateSubscriptionStatus(UID, response, subscription);
    }
    catch(error){
      response.writeHead(404, { "Content-type": "text/plain" });
      response.write("Failed to Update User");
      response.end();
      
    }
  });
}

async function captureSubscriptionPayment(request, response){
  var credentials = "";


  request.on("data", (data) => {
    credentials += data;
  });

  request.on("end", async () => {
    credentials = JSON.parse(credentials);
    var subscriptionID = credentials.subscriptionID;
    await paypal.captureSubscriptionPayment(subscriptionID, response);
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

  if (path == "/get/products"){
    file = __dirname + "/json" + "/ProductsSold.json";
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
      /**
       * Prescription Section Start
       */

      case "/prescription/get/accountType":
        getTypeProcess(request,response,queryStringParameters);
        break;

      case "/prescription/add/patient":
        addPatientPrescriptionProcess(request,response);
        break;

      case "/prescription/add/doctor":
        addDoctorPrescriptionProcess(request,response);
        break;

      case "/prescription/check/prescriptionNumber":
        checkPrescriptionProcess(request,response,queryStringParameters);
        break;

      case "/prescription/attempt/validation":
        validateProcess(request,response);
        break;

      case "/prescription/active":
        changeStatusProcess(request,response);
        break;

      case "/prescription/send/validated/email":
        sendValidatedPrescriptionNotificationProcess(request,response,queryStringParameters);
        break;

      case "/html/prescription/request/email":
        sendPrescriptionEmailProcess(request,response);
        break;

      case "/html/random/prescription":
        getRandomPrescriptionProcess(request,response);
        break;

      case "/prescription/get/drugs":
        getDrugsProcess(request,response,queryStringParameters);
        break;

      case "/prescription/get/list":
        getDrugListProcess(request,response);
        break;

      case "/prescription/send/error/email":
        sendErrorEmailProcess(request,response);
        break;

      case "/prescription/remove/doctor":
        removeDoctorPrescriptionProcess(request,response);
        break;

      case "/prescription/remove/patient":
        removePatientPrescriptionProcess(request,response);
        break;

      case "/prescription/dropdown/patient":
        dropDownProcess(request,response,queryStringParameters);
        break;

      case "/prescription/display":
        displayProcess(request,response);
        break;

      case "/prescription/pharmacy/list":
        getPharamacyProcess(request,response);
        break;

      case "/prescriptions/recycle":
        recyclePrescriptionProcess(request,response,queryStringParameters);
        break;

      case "/prescription/dropdown/doctor":
        doctorDropDownProcess(request,response,queryStringParameters);
        break;

      case "/prescription/dropdown/doctor/valid":
        doctorDropDownValidProcess(request,response,queryStringParameters);
        break;

      case "/prescription/display/doctor/pending":
        displayDoctorPendingProcess(request,response,queryStringParameters);
        break;

      case "/prescription/display/doctor/valid":
        displayDoctorValidProcess(request,response,queryStringParameters);
        break;

      case "/prescription/reminder/email":
        sendReminderEmailProcess(request,response,queryStringParameters);
        break;
      /**
       * Prescription Section End
       */

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

      case "/knowledgebase/search":
        knowledgeBaseSearch(request, response, queryStringParameters);
        break;

      case "/faq/search":
        FAQ(request, response, queryStringParameters);
        break;

      case "/faq/articles":
        getFAQ(request, response);
        break;

      case "/products/refreshImg":
        refreshPathsProduct(request, response);
        break;

      case "/products/create":
        createProduct(request, response);
        break;

      case "/products/receiveProductImage":
        receiveDrugFileImage(request, response);
        break;

      case "/products/matchProductName":
        getProductByName(request, response, queryStringParameters);
        break;

      case "/products/countProducts":
        getTotalProductCount(request, response);
        break;

      case "/products/getAllOTC":
        getAllOTC(request, response);
        break;

      case "/products/getAllPrescription":
        getAllPrescription(request, response);
        break;

      case "/test/createOrder":
        testCreateOrder(request, response);
        break;

      case "/api/updateCart":
        console.log("updating the cart: /api/updateCart");
        updateCart(request, response);
        break;

      case "/testMake":
        createMyMessageProcess(request, response);
        break;

      case "/update/user":
        updateUser(request, response);
        break;

      case "/contact-us":
        sendContactEmail(request, response);
        break;

      case "/get/medications":
        getMedicationsUser(request, response, queryStringParameters);
        break;

      case "/get/prescriptionDrugs":
        console.log("the query parameters are" +queryStringParameters);
        getDrugData(request, response, queryStringParameters);
        break;

      case "/get/prescriptions/user":
        getPrescriptionsUser(request, response, queryStringParameters);
        break;

      case "/get/orders/user":
        getOrdersUser(request, response, queryStringParameters);
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

      case "/delete/account":
        deleteAccount(request, response, queryStringParameters);
        break;

      case "/get/cart":
        getUserCart(request, response, queryStringParameters);
        break;

      case "/upload/documentation":
        uploadDocumentation(request, response, queryStringParameters);
        break;

      case "/download/orders":
        downloadOrders(request, response, queryStringParameters);
        break;
      
      case "/download/prescriptions":
        downloadPrescriptions(request, response, queryStringParameters);
        break;

      case "/fetch/user/documentation":
        getUserDocumentation(request, response);
        break;

      case "/update/documentation/status":
        updateDocumentationStatus(request, response);
        break;

      case "/download/file":
        downloadUserFile(request, response, queryStringParameters);
        break;

      case "/verify/documentation":
        break;
      
      case "/ready/order":
        makeOrderReady(request, response, queryStringParameters);
        break;
      
      case "/claim/order":
        makeOrderClaimed(request, response, queryStringParameters);
        break;
      
      case "/get/ready/orders":
        getReadyOrders(request, response);
        break;
      
      case "/get/pharmacies":
        getPharmacies(request, response);
        break;
      
      case "/updateLocation/order":
        
        updateOrderLocation(request, response);
        break;
      
      case "/update/subscriptionStatus":
        updateSubscriptionStatus(request, response);
        break;
      
      case "/update/subscriptionStatus/capture":
        captureSubscriptionPayment(request, response);
        break;
    }
  }

  else {
    //Client is requesting a file
    console.log("Serving File Content: " + file);
    serveFileContent(file, response);
  }

  let reqUrl = url.parse(request.url).pathname == "/" ? "index.html" : url.parse(request.url).pathname;
  let captureUrl = reqUrl.match(/^\/api\/orders\/([^\/]+)\/capture$/);

  if (reqUrl === "/api/orders" && request.method == "POST") {
    var credentials = "";

    request.on("data", (data) => {
      credentials += data;
    });

    request.on("end", async () => {
      var uid = JSON.parse(credentials).uid;
      var pid = JSON.parse(credentials).pid;
      var pharmacyAddress = JSON.parse(credentials).pharmacyAddress;
      console.log("User's UID: ", uid);
      paypal
      .createOrder(uid, pid, pharmacyAddress)
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


  } else if (captureUrl != null && reqUrl === captureUrl[0] && request.method == "POST") {
    const orderId = captureUrl[1];
    console.log(orderId);
    paypal.capturePayment(orderId)
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
