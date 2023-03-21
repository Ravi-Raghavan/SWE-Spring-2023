const CLIENT_ID = "ATRkqSYtViDKAC5pDqNHep_HRLwEKkDSt4cp97r4u1KeV_Ca8SL1gQj_lhPv5-71TSEt6GdtkkuGDhzt"
const APP_SECRET = "EOgSXbL9wbXoocQCIymU0GPibLjs9_HDpTCqtZxpru5ONHC2Nq5Zkgxb01xMZ1sMG_qAdEt5Rg0tR4H5"

const base = "https://api-m.sandbox.paypal.com";

const admin = require("./firebase").admin;
const cartRef = admin.database().ref("/carts/");
const orderRef = admin.database().ref("/orders/");
const userRef = admin.database().ref("/users/");

var uid;
async function createOrder(userID) {
    var purchaseAmount;
    uid = userID;
    cartRef.child(userID).once("value")
        .then((snapshot) => {
            purchaseAmount = snapshot.val().cartTotal;
            console.log("Variable read from Firebase successfully:", snapshot.val().cartTotal);
        })
        .catch((error) => {
            console.error("Error reading variable from Firebase:", error);
        });
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: purchaseAmount
                    },
                },
            ],
        }),
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    console.log(data);
    cartRef.child(uid).once("value")
        .then((snapshot) => {
            orderRef.child(uid).set(snapshot.val());
            userRef.child(uid).child("/orders/").set(snapshot.val());
        })
        .catch((error) => {
            console.error("Error reading variable from Firebase:", error);
        })
    return data;
}

async function generateAccessToken() {
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization:
                "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
        },
    });
    const data = await response.json();
    console.log(data);
    return data.access_token;
}

module.exports = { createOrder, capturePayment }
