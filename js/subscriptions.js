paypal.Buttons({
    createOrder: (data, actions) => {
        return fetch("/update/subscriptionStatus", {
            method: "POST",
            body: JSON.stringify({
                UID: JSON.parse(window.localStorage.getItem("User Record")).uid
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
    
      onApprove: (data) =>  {
        return fetch(`/update/subscriptionStatus/capture`, {
            method: "post",
            body: JSON.stringify({
                subscriptionID: data.orderID
            })
        })
      }
})
.render("#paypal-button-container")
// .then(() => alert("SUCCESS"))
// .catch((err) => alert(err));

function getUID(){
    if(localStorage.getItem("User Record")==null){
      alert("Please create an account / log in, to add a prescription. Thank You!");
    }else{
      var user_record = JSON.parse(localStorage.getItem("User Record"));
      var uid = user_record.uid;
      return uid;
    }
  }
