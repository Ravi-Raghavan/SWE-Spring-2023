const fs = require('fs');
const Product = require('./productModel');
const { getPostData } = require('./utils');

// When our client requests to create a new product (with our request data); 
// @route POST /api/products/
async function createProduct(req, res) {
    try {
        let body = await getPostData(req);
        
        const {filename, limit, name, price, requiresPrescription} = JSON.parse(body);
        let imgPath = `../product/${filename}`;

        if(req.method !== 'POST') {
            res.writeHead(405, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'405 Error Message': 'only POST is valid'}));
            return;
        }

        if(await Product.matchProductName(name) !== null) {
            res.writeHead(406, {'Content-Type': 'application/json'});
            console.log('bruh');
            res.end(JSON.stringify({'406 Error Message': 'product already exists'}));
            return;
        }

        if(price <= 0) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'405 Error Message': 'negative price not allowed'}));
            return;
        }

        if(!Number.isInteger(limit) || limit < 0) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({'400 Error Message': 'integer and positive limit is required'}));
            return;
        }

        var counter = 0;
        while(fs.existsSync(imgPath)) {
            let imgPath = `../product/${counter}${filename}`;
            counter++;
        }

        const productRef = await Product.create(name, requiresPrescription, limit, price, imgPath);
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

async function receiveDrugFileImage(req, res) {
    if(req.method === 'POST') {
        const filename = req.headers["filename"];
        const fileStoragePath = `product/${filename}`;
        req.on("data", chunk => {
            fs.appendFileSync(fileStoragePath, chunk);
            // console.log('')
        });
        req.on("end", async () => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({'success': 'image received successfully'}));
            res.end();
        })
    } else {
        res.writeHead(405, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({'405 Error Message': 'Tried to use endpoint while not using POST method'}));
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
    receiveDrugFileImage,
    getProductByName,
    getTotalProductCount,
    getAllOTC,
    getAllPrescription
}