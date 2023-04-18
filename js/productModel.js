const admin = require('./firebase').admin;
const db = admin.database();
const ref = db.ref('/Products/');

const prescriptionRef = db.ref('/Drugs/Prescription/');
const otcRef = db.ref('/Drugs/OTC/');

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

async function matchProductName(productName) {
    let result = null;

    let ref = null; // Caution
    ref = otcRef.orderByChild('name').equalTo(productName);
    await ref.once('value', (snapshot) => {
        console.log(snapshot.val());
        let info = snapshot.val();
        let key = snapshot.key;
        if(info != null) {
            result = snapshot.child(productName).val();
            result.requiresPrescription = false;
        }
    })

    ref = prescriptionRef.orderByChild('name').equalTo(productName);
    await ref.once('value', (snapshot) => {
        console.log(snapshot.val());
        let info = snapshot.val();
        let key = snapshot.key;
        if(info != null) {
            result = snapshot.child(productName).val();
            result.requiresPrescription = true;
        }
    })

    return result;
}

module.exports = {
    create,
    matchProductName
};