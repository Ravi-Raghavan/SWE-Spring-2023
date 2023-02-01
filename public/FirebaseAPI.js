//helper functions to interface with Firebase API 

const { createMockUserToken } = require("@firebase/util");

const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref("/users/");


//Function to create a user in our database
//userParameters: parameters for a particular user(i.e. name, email, etc)
async function createUser(userParameters, response){
    //Create the user in the authentication table
    let userCredentials = await admin.auth().createUser({
        email: userParameters.email,
        emailVerified: true, 
        password: userParameters.password,
        displayName: userParameters.displayName,
        photoURL: userParameters.picture,
        disabled: userParameters.disabled
    })
    
    //Create the user in the database table
    console.log("User Credentials: " + userCredentials.toJSON());
    var userRecord = userCredentials.toJSON();
    var uid = userRecord.uid;

    ref.child(`${uid}`).set({
        uid: uid,
        email: userRecord.email,
        emailVerified: userParameters.emailVerified,
        password: userParameters.password, 
        displayName: userParameters.displayName,
        photoURL: userParameters.picture,
        disabled: userParameters.disabled
    })

    //Send Request
    var userRecord = userCredentials.toJSON();
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write(CryptoJS.AES.encrypt(JSON.stringify(userRecord), "UserRecord").toString());
    response.end();
}

//This function is responsible for searching for a user in the database. Returns "True" if user is there. Else, returns "False"
async function searchUser(searchParameters){
    var email = searchParameters.email;

    var doesExist = await new Promise((resolve, reject) => {
        admin.auth().getUserByEmail(email)
        .then((userCredentials) => {
            var userRecord = userCredentials.toJSON();
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


module.exports = {
    createUser: createUser,
    searchUser: searchUser
}