//helper functions to interface with Firebase API 
var CryptoJS = require("crypto-js");
const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref(`/users/`);
var validatedPrescriptions = db.ref(`/validatedPrescriptions/`);
var cartRef = db.ref("/carts/")

//Function to create a user(i.e. registration!) in our database
//userParameters: parameters for a particular user(i.e. name, email, etc)
async function register(userParameters, response){

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
        address: "10 Frelinghuysen Road, Piscataway, New Jersey, 08854"
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

            userRecord["Account Type"] = accountType;
            userRecord["Subscription Plan"] = subscriptionPlan;
            userRecord.phoneNumber = phoneNumber;
            userRecord["Address"] = address;

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
    
    if (userParameters.phoneNumber == null){
        userParameters.phoneNumber = "123-456-7890";
    }

    if (userParameters.address == null){
        userParameters.address = "110 Frelinghuysen Road, Piscataway, NJ, 08854";
    }

    ref.child(`${uid}`).update({
        phoneNumber: userParameters.phoneNumber,
        address: userParameters.address
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

module.exports = {
    register: register,
    search: search,
    isValidated: isValidated,
    getAccountType: getAccountType,
    getSubscriptionPlan: getSubscriptionPlan,
    getPhoneNumber: getPhoneNumber,
    getAddress: getAddress, 
    updateUser: updateUser,
    getPrescriptionsUser: getPrescriptionsUser,
    getOrdersUser: getOrdersUser,
    addPaymentCard: addPaymentCard, 
    getPaymentCards: getPaymentCards, 
    deletePaymentCard: deletePaymentCard,
    deleteUserAccount: deleteUserAccount,
    getUserCart: getUserCart,
    login: login
}