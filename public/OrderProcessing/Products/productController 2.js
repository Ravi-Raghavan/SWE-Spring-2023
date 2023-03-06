const Product = require('./productModel');
const { getPostData } = require('../../utils');

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

module.exports = {
    createProduct
}