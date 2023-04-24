const CLIENT_ID = "ATRkqSYtViDKAC5pDqNHep_HRLwEKkDSt4cp97r4u1KeV_Ca8SL1gQj_lhPv5-71TSEt6GdtkkuGDhzt"
const APP_SECRET = "EOgSXbL9wbXoocQCIymU0GPibLjs9_HDpTCqtZxpru5ONHC2Nq5Zkgxb01xMZ1sMG_qAdEt5Rg0tR4H5"

const base = "https://api-m.sandbox.paypal.com";

const admin = require("./firebase").admin;
const cartRef = admin.database().ref("/carts/");
const orderRef = admin.database().ref("/orders/");
const userRef = admin.database().ref("/users/");

const mailer = require("nodemailer");
var transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: "swespring2023@gmail.com",
        pass: "lotrlepvzmwdnsny"
    }
});

// function getemail(uid) {
//     userRef.child(uid).once("value")
//         .then((snapshot) => {
//             email = snapshot.val().email;
//             console.log("Variable read from Firebase successfully:", email);
//         })
//         .catch((error) => {
//             console.error("Error reading variable from Firebase:", error);
//         });
//     return email;
// }

var uid;
var pid; //pharmacy id
var pharmAddress; //pharmacy address
async function createOrder(userID, pharmacyID, pharmacyAddress) {
    var purchaseAmount;
    uid = userID;
    pid = pharmacyID;
    pharmAddress = pharmacyAddress;

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

async function createSubscription() {
    var purchaseAmount = 10;
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

async function captureSubscriptionPayment(subscriptionID, response){
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${subscriptionID}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    console.log(data);

    if (data.status == "COMPLETED"){
        response.writeHead(200, { "Content-type": "text/plain" });
        response.write("Captured Subscription Payment!");
        response.end();
    }
    else{
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write("Failed to Capture Subscription Payment");
        response.end();
    }

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
    if (data.status == "COMPLETED") {
        cartRef.child(uid).once("value")
            .then((snapshot) => {
                let orderPushRef = orderRef.child(uid).push();
                orderPushRef.set(snapshot.val());

                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                let date_time = new Date();

                // get current date
                // adjust 0 before single digit date
                let date = ("0" + date_time.getDate()).slice(-2);

                // get current month
                let month = monthNames[date_time.getMonth()];

                // get current year
                let year = date_time.getFullYear();

                orderPushRef.child("orderDate").set(`${month} ${date} ${year}`);
                orderPushRef.child("status").set("Pending");
                orderPushRef.child("pharmAddress").set(pharmAddress);
                orderPushRef.child("location").set("0");

                userRef.child(uid).child("/orders/").child(orderPushRef.key).set(snapshot.val());
                userRef.child(uid).child("/orders/").child(orderPushRef.key).child("status").set("Pending");
                userRef.child(uid).child("/orders/").child(orderPushRef.key).child("orderDate").set(`${month} ${date} ${year}`);
                userRef.child(uid).child("/orders/").child(orderPushRef.key).child("pharmAddress").set(pharmAddress);
                userRef.child(uid).child("/orders/").child(orderPushRef.key).child("location").set("0");

                console.log("PID: " + pid);
                userRef.child(pid).child("/orders/").child(orderPushRef.key).set(snapshot.val());

                /**DELETE CART */
                cartRef.child(uid).set(null)
                    .then(() => {
                        console.log("Cart is Deleted!");
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((error) => {
                console.error("Error reading variable from Firebase:", error);
            })
        var mailOptions = {
            from: "swespring2023@gmail.com",
            to: data.payment_source.paypal.email_address,
            subject: "Order Confirmed!",
            text: "Congratulations, your payment has been verified and the order is on its way!"
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } else {
        alert("Payment could not be completed");
    }
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

module.exports = { createOrder, capturePayment, createSubscription, captureSubscriptionPayment }
