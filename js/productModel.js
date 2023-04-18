const admin = require('./firebase').admin;
const db = admin.database();
const ref = db.ref('/Products/');

const drugsRef = db.ref('/Drugs/');
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

async function getNumProducts() {
    let count = 0;
    await drugsRef.once('value', (snapshot) => {
        count += snapshot.numChildren();
    })
    await otcRef.once('value', (snapshot) => {
        count += snapshot.numChildren();
    });

    return count;
}

async function getAll(type) {
    let res;
    await drugsRef.child(type).once('value', (snapshot) => {
        res = snapshot.val();
    });

    if(res === null) throw Error("bro something bad happen :(");

    return res;
}

module.exports = {
    create,
    matchProductName,
    getNumProducts,
    getAll
};