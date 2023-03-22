const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref(`/orders/`);
var cartRef = db.ref("/carts/");

/* Given a status (string), are we able to cancel the order? Return a boolean. */
function canCancel(status) {
    switch(status) {
        case 'placed':
            var cancellable = true;
            break;
        default:
            var cancellable = false;
    }

    return cancellable
}

/* Create an order for a specific user ID */
// OwnerID - Some user's ID
// Costs - TOTAL cost of drugs as a floating point vlaue
// Drugs - Array of order items (array of strings basically)
// Quantity - Number of these orders that we are getting (we intention this to be number of prescriptions to use)
async function create(ownerID, costs, drugs, quantity) {
    // First, check if the user exists.
    userRef = db.ref(`/users/`);

    let exists = await new Promise((resolve, reject) => {
        userRef.child(ownerID).once('value', (snapshot) => {
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
        userRef.child(ownerID).once('value', (snapshot) => {
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
async function cancel(requesterID, orderID) {
    // We need to refer to the order via the child of orders reference
    // ref.child(orderID).ex
    const uid = await new Promise((resolve, reject) => {
        ref.child(orderID).once('value', (snapshot) => {
            const userInfo = snapshot.val();
            
        }) 
    })
}

async function createPrescription() {
    
}

async function update(orderID, costs, quantity, status, drug){
        
    const userRef = db.ref(`/users/`);

    let exists = await new Promise((resolve, reject) => {
        userRef.child(orderID).once('value', (snapshot) => {
            var userInfo = snapshot.val();
            // console.log(userInfo);
            resolve(userInfo !== "null");
        }), (errorObject) => {
            reject(errorObject.val());
        }
    });
        //Write data to file
        
        const oID = ref.child(orderID).update({
            status: status || ref.status,
            quantity: quantity || ref.quantity,
            costs: costs || ref.costs,
            drugs: [ref.drugs, drug] || ref.drugs, //trying to append to list


        });
        
        console.log('Order updated');
        return oID;

}

async function costUpdate(orderID, costs, quantity, drug){
    const userRef = db.ref(`users`);

    let exists = await new Promise((resolve, reject) => {
        let curQuantity = 0;
    try {
       
        var Ref = ref.child(orderID).once('value', (snapshot) => {
                var orderInfo = snapshot.val();
                console.log(orderInfo);
                curQuantity += orderInfo.quantity;
                //console.log("quantity: ",curQuantity)

                resolve(orderInfo !== 'null');
        });

        //console.log("current quantity is: ", curQuantity)
        ref.child(orderID).update(
            {
            'costs' : (costs),
            'quantity' : (quantity)
            }
        );
        
    
    } catch (err) {
        reject(err)
    }
    });

        
        console.log('Order updated');
        return ref.child(orderID);

}

async function testUpdate(orderID, title, quantity, price){
    const userRef = db.ref(`users`);
    var updateVal;

    let exists = await new Promise((resolve, reject) => {
    try { 
            const drugRef = ref.child(orderID).child('drugs').push();
            drugRef.set({
                title,
                quantity,
                price,
            
            })
    

    } catch (err) {
        reject(err)
    }
    });
        console.log('Drug Added');
        return ref.child(orderID);

}

async function updateUserCart(cartTotal, drugs, uid){
    cartRef.child(`${uid}`).set({
        cartTotal: cartTotal, 
        drugs: drugs, 
        uid: uid
    })
    .then(() => {
        console.log(`Cart Updated for User: ${uid}`);
    })
    .catch((err) => {
        console.log('Cart Failed to be Updated');
    })
}


module.exports = {
    create,
    update,
    createOrder,
    testUpdate,
    updateUserCart,
    costUpdate
};
