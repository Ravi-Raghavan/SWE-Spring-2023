paypal.Buttons({
        // Sets up the transaction when a payment button is clicked
        createOrder: (data, actions) => {
            return fetch("/api/orders", {
                method: "POST",
                body: JSON.stringify({
                    uid: JSON.parse(window.localStorage.getItem("User Record")).uid,
                    pid: JSON.parse(window.localStorage.getItem("User Record")).pid
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
                .then(function (orderData) {
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

                    // When ready to go live, remove the alert and show a success message within this page. For example:
                    // var element = document.getElementById('paypal-button-container');
                    // element.innerHTML = '';
                    // element.innerHTML = '<h3>Thank you for your payment!</h3>';
                    // Or go to another URL:  actions.redirect('thank_you.html');
                });
        },
    }).render("#paypal-button-container");
