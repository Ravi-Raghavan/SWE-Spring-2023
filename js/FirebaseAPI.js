//helper functions to interface with Firebase API 
var CryptoJS = require("crypto-js");
const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref(`/users/`);
var validatedPrescriptions = db.ref(`/validatedPrescriptions/`);
var prescriptionDrugs = db.ref(`/Drugs/Prescription/`);
var cartRef = db.ref("/carts/")
var pdf = require("pdf-creator-node");
var fs = require("fs");
var SMTP = require("./SMTP");
var orderRef = db.ref("/orders");


//Function to create a user(i.e. registration!) in our database
//userParameters: parameters for a particular user(i.e. name, email, etc)
async function register(userParameters, response){
/*
    if (userParameters.accountType == "Admin" && userParameters.email != "swespring2023@gmail.com"){
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write(`Cannot create another admin account!`);
        response.end();
        return;
    }
*/
    //Create the user in the authentication table
    let userCredentials = await admin.auth().createUser({
        email: userParameters.email,
        emailVerified: userParameters.emailVerified, 
        password: userParameters.password,
        displayName: userParameters.displayName,
        photoURL: userParameters.photoURL,
        disabled: userParameters.disabled
    })
    
    //Create the user in the database table
    var userRecord = userCredentials.toJSON();
    var accountType = userParameters.accountType;

    var currentDateTime = new Date().toString();
    userRecord["metadata"]["lastSignInTime"] = currentDateTime;
    userRecord["metadata"]["lastRefreshTime"] = currentDateTime;
    userRecord["tokensValidAfterTime"] = currentDateTime;
    userRecord["Account Type"] = accountType;
    userRecord["Subscription Plan"] = "Free";
    userRecord.phoneNumber = "123-456-7890"
    userRecord["Address"] = "10 Frelinghuysen Road, Piscataway, New Jersey, 08854"
    userRecord["Documentation Verified"] = false;

    console.log("==========USER RECORD ==============");
    console.log(userRecord);
    console.log("=========================");

    
    var uid = userRecord.uid;
    ref.child(`${uid}`).set({
        uid: uid,
        email: userRecord.email,
        emailVerified: userParameters.emailVerified,
        password: userParameters.password, 
        displayName: userParameters.displayName,
        photoURL: userParameters.photoURL,
        disabled: userParameters.disabled,
        accountType: accountType,
        subscriptionPlan: "Free",
        phoneNumber: "123-456-7890",
        address: "10 Frelinghuysen Road, Piscataway, New Jersey, 08854",
        documentationVerified: false
    })

    //Send Request
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
    response.end();
}

//This function is responsible for searching for a user in the database. Returns "True" if user is there. Else, returns "False"
async function search(searchParameters){
    var email = searchParameters.email;

    var doesExist = await new Promise((resolve, reject) => {
        admin.auth().getUserByEmail(email)
        .then(async (userCredentials) => {
            var userRecord = userCredentials.toJSON();
            var uid = userRecord.uid;
            var accountType = await getAccountType(uid);
            var subscriptionPlan = await getSubscriptionPlan(uid);
            var phoneNumber = await getPhoneNumber(uid);
            var address = await getAddress(uid);
            var documentationVerified = await getDocumentationValidationStatus(uid);

            userRecord["Account Type"] = accountType;
            userRecord["Subscription Plan"] = subscriptionPlan;
            userRecord.phoneNumber = phoneNumber;
            userRecord["Address"] = address;
            userRecord["Documentation Verified"] = documentationVerified;

            resolve(JSON.stringify(userRecord));
        })
        .catch((err) => {
            if (err.code == 'auth/user-not-found'){
                resolve("N/A")
            }
        })
    })

    return doesExist;
}

//function which checks if a user's email has been validated yet
async function isValidated(uid, response){
    ref.child(`${uid}`).once('value', (snapshot) => {
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
}

//get account type of user with given uid
async function getAccountType(uid){
    var accountType = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).once('value', (snapshot) => {
            var value = snapshot.val();
            if (value == null){
                resolve("N/A");
            }
            else{
                var accountType = value["accountType"];
                resolve(accountType);
            }
        })
    })
    return accountType;
}

async function getDocumentationValidationStatus(uid){
    var documentationValidationStatus = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).once('value', (snapshot) => {
            var value = snapshot.val();
            if (value == null){
                resolve("false");
            }
            else{
                var documentationVerified = value["documentationVerified"];

                var responseContent = "false";

                if (documentationVerified){
                    responseContent = "true";
                }
                resolve(responseContent);
            }
        })
    })

    if (documentationValidationStatus === "true"){
        return true;
    }

    return false;
}

//get subscription plan for user based on uid
async function getSubscriptionPlan(uid){
    var subscriptionPlan = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).once('value', (snapshot) => {
            var value = snapshot.val();
            if (value == null){
                resolve("N/A");
            }
            else{
                var subscriptionPlan = value["subscriptionPlan"];
                resolve(subscriptionPlan);
            }
        })
    })

    return subscriptionPlan;
}

//get phone number for user based on uid
async function getPhoneNumber(uid){
    var phoneNumber = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).once('value', (snapshot) => {
            var value = snapshot.val();
            if (value == null){
                resolve("N/A");
            }
            else{
                var phoneNumber = value["phoneNumber"];
                resolve(phoneNumber);
            }
        })
    })

    return phoneNumber;
}

// get email address for user based on uid.
// MUST handle the error of invalid uid in some way, either through then().catch(), or try/catch.
async function getEmail(uid) {
    const email = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).once('value', (snapshot) => {
            if (snapshot.val() == null) {
                reject("invalid uid");
            } else {
                resolve(snapshot.child("email").val());
            }
        })
    })

    return email;
}

//get address for user based on uid
async function getAddress(uid){
    var address = await new Promise((resolve, reject) => {
        ref.child(`${uid}`).once('value', (snapshot) => {
            var value = snapshot.val();
            if (value == null){
                resolve("N/A");
            }
            else{
                var address = value["address"];
                resolve(address);
            }
        })
    })

    return address;
}

//login user
async function login(userParameters, response){
    var userRecord = await search(userParameters);

    if (userRecord == "N/A"){
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write(`Account associated with ${userParameters.email} doesn't exist!`);
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
        //response.write(userRecord);
        response.end();
    }
}

async function updateUser(userParameters, response){
    var uid = userParameters.uid;

    var documentationVerified = false;

    if (userParameters.documentationVerified != null){
        documentationVerified = userParameters.documentationVerified;
    }
    
    if (userParameters.phoneNumber == null){
        userParameters.phoneNumber = "123-456-7890";
    }

    if (userParameters.address == null){
        userParameters.address = "110 Frelinghuysen Road, Piscataway, NJ, 08854";
    }

    ref.child(`${uid}`).update({
        phoneNumber: userParameters.phoneNumber,
        address: userParameters.address,
        documentationVerified: documentationVerified
    })
    .then(() => {
        response.writeHead(200, { "Content-type": "text/plain" });
        response.write("Successfully Updated");
        response.end();
    })
    .catch((err) => {
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write("Failed to Update User");
        response.end();
    })
}
async function getMedicationsUser(uid, response){
    var medicationArray = [];

    validatedPrescriptions.child(`${uid}`).once('value', (snapshot) => {
        var value = snapshot.val();
        if (value == null){
            var prescription_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(prescription_data));
            response.end();
        }
        else{
            snapshot.forEach((childSnapshot) => {
                const medication = childSnapshot.val().medication;

                medicationArray.push(medication);
            })
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(medicationArray));
            response.end();
        }
    })
}

async function getDrugData(medicine, response){
    // console.log(medicine);
    prescriptionDrugs.child(`${medicine}`).once('value', (snapshot) => {
        var data = snapshot.val();
        console.log(data);
        if (data == null){
            var prescription_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(prescription_data));
            response.end();
        }
        else{
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(data));
            response.end();
        }
    }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
    });
}

async function getPrescriptionsUser(uid, response){
    validatedPrescriptions.child(`${uid}`).once('value', (snapshot) => {
        var value = snapshot.val();
        if (value == null){
            var prescription_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(prescription_data));
            response.end();
        }
        else{
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(value));
            response.end();
        }
    })
}

async function addPaymentCard(credentials, response){
    var uid = credentials.uid;
    var paymentsRef = ref.child(`${uid}/payment_cards`)

    paymentsRef.push().set(credentials)
    .then(() => {
        response.writeHead(200, { "Content-type": "text/plain" });
        response.write("Successfully Updated");
        response.end();
    })
    .catch((err) => {
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write("Failed to Update User");
        response.end();
    })
}

async function getPaymentCards(credentials, response){
    var uid = credentials.uid;
    var paymentsRef = ref.child(`${uid}/payment_cards`)

    paymentsRef.once('value', (snapshot) => {
        var value = snapshot.val();
        if (value == null){
            var payment_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(payment_data));
            response.end();
        }
        else{
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(value));
            response.end();
        }
    })
}

async function getOrdersUser(credentials, response){
    var uid = credentials.uid;
    var ordersRef = ref.child(`${uid}/orders`)
    console.log("UID: " + uid);

    ordersRef.once('value', (snapshot) => {
        var value = snapshot.val();
        console.log("Orders Data: " + JSON.stringify(value));
        if (value == null){
            var orders_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(orders_data));
            response.end();
        }
        else{
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(value));
            response.end();
        }
    })
}

async function deletePaymentCard(credentials, response){
    var uid = credentials.uid;
    var paymentsRef = ref.child(`${uid}/payment_cards`)

    paymentsRef.once('value', (snapshot) => {
        var value = snapshot.val();
        console.log("Value: " + JSON.stringify(value));
        if (value == null){
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Failed to Delete Payment Card");
            response.end();
        }
        else{
            var paymentCardID = "";

            for (var paymentCardKey in value){
                var paymentCard = value[paymentCardKey]

                if (paymentCard.cardNumber == credentials.cardNumber){
                    paymentCardID = paymentCardKey;
                }
            }

            console.log("HERE: " + paymentCardID);
            ref.child(`${uid}/payment_cards/${paymentCardID}`).set(null)
            .then(() => {
                console.log("Success!");
                response.writeHead(200, { "Content-type": "text/plain" });
                response.write("Successfully Delete Payment Card");
                response.end();
            })
            .catch((err) => {
                console.log(err);
                response.writeHead(404, { "Content-type": "text/plain" });
                response.write("Failed to Delete Payment Card");
                response.end();
            })
        }
    })
}

async function deleteUserAccount(credentials, response){
    var uid = credentials.uid;

    admin.auth().deleteUser(uid)
    .then(() => {

        ref.child(`${uid}`).set(null)
        .then(() => {
            console.log("Success!");
            response.writeHead(200, { "Content-type": "text/plain" });
            response.write("Successfully Deleted User Account");
            response.end();
        })
        .catch((err) => {
            console.log(err);
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Failed to Delete User Account");
            response.end();
        })
    })
    .catch((err) => {
        console.log(err);
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write("Failed to Delete User Account");
        response.end();
    })
}

async function getUserCart(credentials, response){
    var uid = credentials.uid;

    cartRef.child(`${uid}`).once("value", (snapshot) => {
        var value = snapshot.val();
        console.log("Value: " + JSON.stringify(value));

        if (value == null){
            response.writeHead(404, { "Content-type": "application/json" });
            response.write("Failed to Delete Payment Card");
            response.end();
        }
        else{
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(value));
            response.end();
        }
    })
}

async function downloadOrders(credentials, response){
    var uid = credentials.uid;
    var ordersRef = ref.child(`${uid}/orders`)
    console.log("UID: " + uid);

    ordersRef.once('value', (snapshot) => {
        var value = snapshot.val();
        console.log("Orders Data: " + JSON.stringify(value));
        if (value == null){
            var orders_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(orders_data));
            response.end();
        }
        else{
            // Read HTML Template
            var html = fs.readFileSync("./html/orderTemplate.html", "utf8");

            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<div style="text-align: center;"></div>'
                },
                footer: {
                    height: "28mm",
                    contents: {
                        first: 'Cover page',
                        2: 'Second page', // Any page number is working. 1-based index
                        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        last: 'Last Page'
                    }
                }
            };

            var orders = [];

            for (var key in value){
                var order = {}
                order["oid"] = key

                order["drugs"] = []
                for (var drugKey in value[key]["drugs"]){
                    order["drugs"].push({name: value[key]["drugs"][drugKey]["title"], quantity: value[key]["drugs"][drugKey]["quantity"]})
                }

                if (order["status"] == undefined || order["status"] == null){
                    order["status"] = "placed";
                }
                
                order["totalCost"] = value[key]["cartTotal"];

                orders.push(order);
            }

            var document = {
                html: html,
                data: {
                  orders: orders,
                },
                path: `./${uid}-orders.pdf`,
                type: "buffer",
              };
            
              pdf
              .create(document, options)
              .then((res) => {
                console.log(res);
                response.writeHead(200, { "Content-type": "application/pdf", "Content-Length": res.length, "Content-Disposition": `attachment; filename=${uid}-orders.pdf`});
                console.log(typeof res);
                response.end(res);
              })
              .catch((error) => {
                console.error(error);
              });
        }
    })
}

async function downloadPrescriptions(credentials, response){
    var uid = credentials.uid;
    var prescriptionsRef = validatedPrescriptions.child(`${uid}`)
    console.log("UID: " + uid);

    prescriptionsRef.once('value', (snapshot) => {
        var value = snapshot.val();
        console.log("Prescriptions Data: " + JSON.stringify(value));
        if (value == null){
            var prescriptions_data = {"404 Error Message": "N/A"}
            response.writeHead(404, { "Content-type": "application/json" });
            response.write(JSON.stringify(prescriptions_data));
            response.end();
        }
        else{
            // Read HTML Template
            var html = fs.readFileSync("./html/prescriptionTemplate.html", "utf8");

            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<div style="text-align: center;"></div>'
                },
                footer: {
                    height: "28mm",
                    contents: {
                        first: 'Cover page',
                        2: 'Second page', // Any page number is working. 1-based index
                        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        last: 'Last Page'
                    }
                }
            };

            var prescriptions = [];

            for (var key in value){
                var prescription = {}
                prescription["pid"] = value[key]["prescriptionNumber"];
                prescription["fName"] = value[key]["doctorFirstName"];
                prescription["lName"] = value[key]["doctorLastName"];

                prescription["drug"] = value[key]["medication"];
                prescription["quantity"] = value[key]["refills"];
                prescription["expiryDate"] = value[key]["expireDate"];

                prescriptions.push(prescription);
            }

            var document = {
                html: html,
                data: {
                  prescriptions: prescriptions,
                },
                path: `./${uid}-prescriptions.pdf`,
                type: "buffer",
              };
            
              pdf
              .create(document, options)
              .then((res) => {
                console.log(res);
                response.writeHead(200, { "Content-type": "application/pdf", "Content-Length": res.length, "Content-Disposition": `attachment; filename=${uid}-prescriptions.pdf`});
                console.log(typeof res);
                response.end(res);
              })
              .catch((error) => {
                console.error(error);
              });
        }
    })
}

async function getUserDocumentation(response){
    ref.once('value', (snapshot) => {
        var value = snapshot.val();

        if (value == null){
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Failed to Delete Payment Card");
            response.end();
        }
        else{
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(value));
            response.end();
        }
    })

}

async function updateDocumentationStatus(credentials, response){
    var uid = credentials.uid;
    var file_name = credentials.file_name;
    var file_status = credentials.file_status;

    console.log("UID: " + uid);
    console.log("file_name: " + file_name);
    console.log("file_status: " + file_status);

    var fileRef = db.ref(`/users/${uid}/files`);

    fileRef.once('value', (snapshot) => {
        if (!snapshot.exists()){
            console.log("NOOOOOO");
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Failed to Update Doc Status");
            response.end();
        }
        else{
            var fileKeyToUpdate = snapshot.val();
            var fileKey = ""

            console.log(JSON.stringify(fileKeyToUpdate));
            for (var key in fileKeyToUpdate){
                if (fileKeyToUpdate[key]["name"] == file_name){
                    fileKey = key;
                }
            }

            const fileNameRef = fileRef.child(`${fileKey}`)

            fileNameRef.update({
                status: file_status
            })
            .then(async () => {
                var email = await getEmail(uid);
                await SMTP.sendDocumentationEmail(email, file_name, file_status);
                response.writeHead(200, { "Content-type": "text/plain" });
                response.write("Successfully Updated Doc Status");
                response.end();
            })
            .catch(() => {
                response.writeHead(404, { "Content-type": "text/plain" });
                response.write("Failed to Update Doc Status");
                response.end();
            })
        }
    });
}

async function markOrderReady(OID, PID, response){
    //Get USER corresponding to this OID
    console.log(OID);
    orderRef.once("value", (snapshot) => {
        if (!snapshot.exists()){
            console.log("NOOOOOO");
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Order doesn't exist");
            response.end();
        }
        else{
            var orders = snapshot.val()
            var UID = "";

            for (var user in orders){
                var user_orders = orders[user];
                for (var user_order in user_orders){
                    if (user_order == OID){
                        UID = user;
                        break;
                    }
                }
            }

            orderRef.child(UID).child(OID).update({
                status: "Ready"
            })
            .then(async () => {
                //SEND EMAIL TO DRIVERS INDICATING THAT ORDER HAS BEEN MARKED AS READY
                notifyDrivers();
                //

                await ref.child(PID).child("orders").child(OID).set(null);
                console.log("Going to update user collection as well");
                ref.child(UID).child("orders").child(OID).update({
                    status: "Ready"
                })
                .then(() => {
                    response.writeHead(200, { "Content-type": "text/plain" });
                    response.write("Successfully Updated");
                    response.end();
                })
                .catch((err) => {
                    console.log(err);
                    response.writeHead(404, { "Content-type": "text/plain" });
                    response.write("Failed to Update Order");
                    response.end();
                })

            })
            .catch((err) => {
                response.writeHead(404, { "Content-type": "text/plain" });
                response.write("Failed to Update Order");
                response.end();
            })


        }
    })
}

async function markOrderClaimed(OID, response){
    //Get USER corresponding to this OID
    console.log(OID);
    orderRef.once("value", (snapshot) => {
        if (!snapshot.exists()){
            console.log("NOOOOOO");
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Order doesn't exist");
            response.end();
        }
        else{
            var orders = snapshot.val()
            var UID = "";

            for (var user in orders){
                var user_orders = orders[user];
                for (var user_order in user_orders){
                    if (user_order == OID){
                        UID = user;
                        break;
                    }
                }
            }

            orderRef.child(UID).child(OID).update({
                status: "Claimed"
            })
            .then(async () => {
                console.log("Going to update user collection as well");
                ref.child(UID).child("orders").child(OID).update({
                    status: "Claimed"
                })
                .then(() => {
                    response.writeHead(200, { "Content-type": "text/plain" });
                    response.write("Successfully Updated");
                    response.end();
                })
                .catch((err) => {
                    console.log(err);
                    response.writeHead(404, { "Content-type": "text/plain" });
                    response.write("Failed to Update Order");
                    response.end();
                })

            })
            .catch((err) => {
                response.writeHead(404, { "Content-type": "text/plain" });
                response.write("Failed to Update Order");
                response.end();
            })


        }
    })
}

async function notifyDrivers(){
    ref.once("value", (snapshot) => {
        var userData = snapshot.val();
        var email_list = []

        for (var userKey in userData){
            var userInfo = userData[userKey];
            if (userInfo["accountType"] === "Delivery Driver"){
                email_list.push(userInfo["email"])
            }
        }

        for (var email in email_list){
            console.log("Email: " + email_list[email]);

            if (email_list[email] != undefined && email_list[email] != null){
                SMTP.sendDriverEmail(email_list[email]);
            }
        }
    })
}

async function getReadyOrders(response){
    orderRef.once("value", (snapshot) => {
        if (!snapshot.exists()){
            console.log("NOOOOOO");
            response.writeHead(404, { "Content-type": "text/plain" });
            response.write("Order doesn't exist");
            response.end();
        }
        else{
            var orders = snapshot.val()

            var ready_orders = []


            for (var user in orders){
                var user_orders = orders[user];
                for (var user_order in user_orders){
                    if (user_orders[user_order].status == "Ready"){
                        var key = `${user_order}`
                        var JSON_Obj = {}
                        JSON_Obj[key] = user_orders[user_order];
                        console.log(JSON_Obj)
                        ready_orders.push(JSON_Obj);
                    }
                }
            }

            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(ready_orders));
            response.end();
        }
    })
}

async function getPharmacies(response){
    ref.once("value", (snapshot) => {
        var userData = snapshot.val();
        var pharmacies = []

        for (var userKey in userData){
            var userInfo = userData[userKey];
            if (userInfo["accountType"] === "Pharmacy"){
                var key = `${userKey}`
                var JSON_Obj = {}
                JSON_Obj[key] = userInfo;
                pharmacies.push(JSON_Obj)
            }
        }

        response.writeHead(200, { "Content-type": "application/json" });
        response.write(JSON.stringify(pharmacies));
        response.end();
    })
}

module.exports = {
    register: register,
    search: search,
    isValidated: isValidated,
    getAccountType: getAccountType,
    getSubscriptionPlan: getSubscriptionPlan,
    getPhoneNumber: getPhoneNumber,
    getEmail: getEmail,
    getAddress: getAddress, 
    updateUser: updateUser,
    getMedicationsUser: getMedicationsUser,
    getDrugData: getDrugData,
    getPrescriptionsUser: getPrescriptionsUser,
    getOrdersUser: getOrdersUser,
    addPaymentCard: addPaymentCard, 
    getPaymentCards: getPaymentCards, 
    deletePaymentCard: deletePaymentCard,
    deleteUserAccount: deleteUserAccount,
    getUserCart: getUserCart,
    downloadOrders: downloadOrders, 
    downloadPrescriptions:downloadPrescriptions,
    getUserDocumentation: getUserDocumentation,
    updateDocumentationStatus: updateDocumentationStatus,
    getDocumentationValidationStatus: getDocumentationValidationStatus,
    login: login,
    markOrderReady:markOrderReady,
    markOrderClaimed: markOrderClaimed,
    getReadyOrders:getReadyOrders,
    getPharmacies : getPharmacies
}