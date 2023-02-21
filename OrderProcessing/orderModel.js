const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref(`/orders/`);

/* Creates a product (e.g. codeine) and adds it to the database of all possible drug types. */
function addProduct(productParams) {
    return new Promise((resolve, reject) => {
        
    })
}