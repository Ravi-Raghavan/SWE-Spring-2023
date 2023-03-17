const Order = require('./orderModel');
const Product = require('./productModel')
const { getPostData } = require('./utils');
const {v4: uuidv4} = require('uuid');

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

// POST request 
// Adds an entry to the list 
async function createOrder(req, res) {
    try {
        let body = await getPostData(req);
        const {costs, drugs, owners, quantity, status} = JSON.parse(body);

        const orderRef = await Order.createOrder(owners, costs, drugs, quantity, status);
        const orderId = orderRef.key;
        
        const data = {
            id: orderId
        };
        console.log(orderId)
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}


async function updateOrder(req, res) {
    try {
        //Add method to check if order exists:
        /*
        if(!product)
        {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({message: 'product not found'}))
        }
        */

        let body = await getPostData(req); //data must have orderID, costs, quantity, status, and drug
        const {orderID, costs, quantity, status, drug} = JSON.parse(body);
        const orderRef = await Order.updateOrder(orderID, costs, quantity, status, drug);
        const orderId = orderRef.key;
        
        const data = {
            id: orderId
        };
        console.log(orderId)
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    testCreateOrder,
    createOrder,
    updateOrder
}