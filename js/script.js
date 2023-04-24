paypal.Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: (data, actions) => {
        return fetch("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                uid: JSON.parse(window.localStorage.getItem("User Record")).uid,
                pid: JSON.parse(window.localStorage.getItem("User Record")).pid,
                pharmacyAddress: JSON.parse(window.localStorage.getItem("User Record")).pharmacyAddress
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                return response.id;
            });
    },

    // Finalize the transaction after payer approval
    onApprove: (data, actions) => {
        return fetch(`/api/orders/${data.orderID}/capture`, {
            method: "post",
        })
            .then((response) => response.json())
            .then(function(orderData) {
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                );
                var transaction = orderData.purchase_units[0].payments.captures[0];
                alert(
                    "Transaction " +
                    transaction.status +
                    ": " +
                    transaction.id +
                    "\n\nSee console for all available details"
                );
                /**
                 * recyle prescriptions start
                 */
                let cartItems = document.querySelectorAll(".cart-item-title");
                cartItems.forEach((item) => {
                    const subItems = item.innerText.split(":");
                    if (subItems.length == 2) {
                        fetch(`/prescriptions/recycle?uid=${getUID()}&prescriptionNumber=${subItems[0]}`, {
                            method: "GET",
                            cache: "no-cache"
                        }).then((response) => {
                            console.log(response.status);
                        })
                    }
                })
                /**
                 * recyle prescriptions end
                 */


                window.location.href = "../html/store.html";


                // When ready to go live, remove the alert and show a success message within this page. For example:
                // var element = document.getElementById('paypal-button-container');
                // element.innerHTML = '';
                // element.innerHTML = '<h3>Thank you for your payment!</h3>';
                // Or go to another URL:  actions.redirect('thank_you.html');
            });
    },
}).render("#paypal-button-container");

function getUID() {
    if (localStorage.getItem("User Record") == null) {
        alert("Please create an account / log in, to add a prescription. Thank You!");
    } else {
        var user_record = JSON.parse(localStorage.getItem("User Record"));
        var uid = user_record.uid;
        return uid;
    }
}
