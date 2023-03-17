const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref(`/orders/`);

/* Create an order for a specific user ID */
// OwnerID - Some user's ID
// Costs - TOTAL cost of drugs as a floating point vlaue
// Drugs - Array of order items (array of strings basically)
// Quantity - Number of these orders that we are getting (we intention this to be number of prescriptions to use)
async function create(ownerID, costs, drugs, quantity) {
    // First, check if the user exists.
    userRef = db.ref(`/users/`);

    let exists = await new Promise((resolve, reject) => {
        userRef.child(ownerID).on('value', (snapshot) => {
            var userInfo = snapshot.val();
            // console.log(userInfo);
            resolve(userInfo !== "null");
        }), (errorObject) => {
            reject(errorObject.val());
        }
    });

    // Add the order to the DB
    const orderID = ref.push({
        status: "placed",
        owner: ownerID,
        quantity: quantity,
        costs: costs,
        drugs: drugs,
    });

    console.log('Order placed');

    return orderID;
}

async function createOrder(ownerID, costs, drugs, quantity, status) {
    // First, check if the user exists.
    userRef = db.ref(`/users/`);

    let exists = await new Promise((resolve, reject) => {
        userRef.child(ownerID).on('value', (snapshot) => {
            var userInfo = snapshot.val();
            // console.log(userInfo);
            resolve(userInfo !== "null");
        }), (errorObject) => {
            reject(errorObject.val());
        }
    });

    // Add the order to the DB
    const orderID = ref.push({
        status: status, //testing out if ref.status will work
        owner: ownerID,
        quantity: quantity,
        costs: costs,
        drugs: drugs,
    });

    console.log('Order placed');

    return orderID;
}


/* Given a user who requests an order cancellation, attempt an order cancel. */
// RequesterID: The ID of the user who wants to request order cancellation
// OrderID: the ID of the order to be cancelled
async function cancelOrder(requesterID, orderID) {
    
}

async function update(orderID, costs, quantity, status, drug){
        
    ref.
        userRef = db.ref(`/users/`);

    let exists = await new Promise((resolve, reject) => {
        userRef.child(orderID).on('value', (snapshot) => {
            var userInfo = snapshot.val();
            // console.log(userInfo);
            resolve(userInfo !== "null");
        }), (errorObject) => {
            reject(errorObject.val());
        }
    });
        //Write data to file
        
        const orderID = ref.push({
            status: status || ref.status,
            quantity: quantity || ref.quantity,
            costs: costs || ref.costs,
            drugs: [ref.drugs, drug] || ref.drugs, //trying to append to list
        });
    

}


module.exports = {
    create,
    update,
    createOrder
};
