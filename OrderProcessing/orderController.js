const Order = require('./orderModel');
const { getPostData } = require('../utils');

// When our client requests to create a new product (with our request data); 
// @route POST /api/products/
async function createProduct(req, res) {
    try {
        let body = await getPostData(req);
        const {name, requiresPrescription, limit} = JSON.parse(body);

        const productRef = await Product.create(name, requiresPrescription, limit, null);
        const productId = productRef.key;
        
        const data = {
            id: productId
        };

        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}


// When our client wants to add an order (FOR TESTING ONLY)
// @route POST /test/createOrder/
async function testCreateOrder(req, res) {
    try {
        let body = await getPostData(req);

        const newOrder = await Order.create(`E7HdqBvDWEbDsk9m1gnDBoMOpXj2`, 50.0, ["Equate Ibuprofen (250mg/50)"], 3);
        const data = {id: newOrder.key};

        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    testCreateOrder
}