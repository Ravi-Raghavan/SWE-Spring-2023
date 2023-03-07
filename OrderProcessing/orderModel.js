const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref(`/orders/`);

/* Creates a product (e.g. codeine) and adds it to the database of all possible drug types. */
function addProduct(productParams) {
    return new Promise((resolve, reject) => {
        
    })
}

/* Create an order for a specific user ID */
// OwnerID - Some user's ID
async function createOrder(ownerID, costs, drugs, quantity) {
    userRef = db.ref(`/users/`);

    // Check if the user exists in the DB
    // userRef.on('value', (snapshot) => {
    //     console.log(snapshot.val())
    // }, (error) => {
    //     console.log(snapshot.error())
    // })

    userRef.child(ownerID).on('value', (snapshot) => {
        console.log(snapshot.val());
    }, (errorObject) => {
        console.log(errorObject.val());
    });

    // Add the order to the DB

    // Update the corresponding user's list of orders
}

module.exports = {
    createOrder
};
