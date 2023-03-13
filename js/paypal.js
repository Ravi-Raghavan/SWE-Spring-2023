const CLIENT_ID = "ATRkqSYtViDKAC5pDqNHep_HRLwEKkDSt4cp97r4u1KeV_Ca8SL1gQj_lhPv5-71TSEt6GdtkkuGDhzt"
const APP_SECRET = "EOgSXbL9wbXoocQCIymU0GPibLjs9_HDpTCqtZxpru5ONHC2Nq5Zkgxb01xMZ1sMG_qAdEt5Rg0tR4H5"

const base = "https://api-m.sandbox.paypal.com";

async function createOrder() {
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
                        value: "100.00",
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
