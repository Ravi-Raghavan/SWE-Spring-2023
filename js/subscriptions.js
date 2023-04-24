paypal.Buttons({
    createSubscription(data, actions) {
        alert("Creating Subscription!");
      },
    
      onApprove(data) {
        alert('You have successfully created subscription ' + data.subscriptionID);
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
