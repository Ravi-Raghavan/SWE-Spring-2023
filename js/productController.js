const Product = require('./productModel');
const { getPostData } = require('./utils');

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

async function getProductByName(req, res, queryStringParameters) {
    try {
        // let body = await getPostData(req);
        // const {name} = JSON.parse(body);
        const name = queryStringParameters["name"];
        const data = await Product.matchProductName(name);

        if(data === null) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify( {"404 Error Message:": "N/A"} ));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        }
    } catch (err) {
        console.log(err);
    }
}

async function getTotalProductCount(req, res) {
    try {
        const data = {
            numProducts: await Product.getNumProducts()
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}

async function getAllOTC(req, res) {
    try {
        const data = await Product.getAll('OTC');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}

async function getAllPrescription(req, res) {
    try {
        const data = await Product.getAll('Prescription');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createProduct,
    getProductByName,
    getTotalProductCount,
    getAllOTC,
    getAllPrescription
}