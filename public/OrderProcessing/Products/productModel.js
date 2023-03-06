const admin = require('../../firebase').admin;
const db = admin.database();
const ref = db.ref('/Products/');

async function create(productName, requiresPrescription, proposedLimit, imageLink) {
    let limit = null;
    if (requiresPrescription) {
        limit = proposedLimit;
    }

    return ref.push({
        name: `${productName}`,
        needsPrescription: `${requiresPrescription}`,
        limit: limit,
        imageLink: imageLink,
        quantity: 0
    });
}

module.exports = {
    create
};