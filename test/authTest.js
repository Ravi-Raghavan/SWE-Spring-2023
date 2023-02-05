const admin = require("../firebase").admin;

var db = admin.database();

userParameters  = {email: "ravi0308raghavan@gmail.com", emailVerified: true, password: "ilovepizza1234", displayName: "Ravi Raghavan", photoURL: "https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg", disabled: false, accountType: "Doctor"};

let userCredentials = admin.auth().createUser({
    email: userParameters.email,
    emailVerified: userParameters.emailVerified, 
    password: userParameters.password,
    displayName: userParameters.displayName,
    photoURL: userParameters.photoURL,
    disabled: userParameters.disabled,
    accountType: userParameters.accountType
})

.then((promise) => {
    admin.auth().getUserByEmail("ravi0308raghavan@gmail.com")
.then((userCredentials) => {
    var userRecord = userCredentials.toJSON();
    console.log(userRecord)
})
.catch((err) => {
    if (err.code == 'auth/user-not-found'){
        console.log("NOOO")
    }
})
})


