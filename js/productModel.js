const admin = require('./firebase').admin;
const db = admin.database();

const drugsRef = db.ref('/Drugs/');
const prescriptionRef = db.ref('/Drugs/Prescription/');
const otcRef = db.ref('/Drugs/OTC/');

/* Does no error checking. Error checking is done in the Controller. */
async function create(productName, requiresPrescription, limit, price, imgPath) {
    const ref = (requiresPrescription ? prescriptionRef : otcRef).child(productName);

    ref.set({
        imgPath: imgPath,
        limit: limit,
        name: productName,
        price: price,
        stock: 100
    });
    return ref;
}

async function matchProductName(productName) {
    let result = null;

    let ref = null; // Caution
    ref = otcRef.orderByChild('name').equalTo(productName);
    await ref.once('value', (snapshot) => {
        let info = snapshot.val();
        let key = snapshot.key;
        if(info != null) {
            result = snapshot.child(productName).val();
            result.requiresPrescription = false;
        }
    })

    ref = prescriptionRef.orderByChild('name').equalTo(productName);
    await ref.once('value', (snapshot) => {
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