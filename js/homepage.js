function handleUserManagingAccount(){
    //If user is not logged in, display alert and go back
    if (localStorage.getItem("User Record") == null){
        alert("Please Create an Account");
    }
    else{
        window.location.href = '../html/dashboard.html';
    }
}

function handleUserManagingPrescriptions(){
    //If user is not logged in, display alert and go back
    if (localStorage.getItem("User Record") == null){
        alert("Please Create an Account");
    }
    else{
        window.location.href = '../html/PrescriptionRequest.html';
    }
}

function handleUserManagingDeliveries(){
    if (localStorage.getItem("User Record") == null){
        alert("Please Create an Account");
    }
    else{
        window.location.href = '../html/deliverypage.html';
    }
}

function getUniqueID(){
        var navigator_info = window.navigator;
        var screen_info = window.screen;
        var uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height  || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';
        return uid;
      }
    
      var deviceID = getUniqueID();

async function login_logout(){
    var innerText = document.getElementById("Link6").innerHTML
    if (innerText == "Log Out"){
        console.log("Leaving the webpage");
        var user_record = JSON.parse(localStorage.getItem("User Record"));
            
        //Write updated User Record to Database
        let response = await fetch('/update/user', {
            method: 'PATCH',
            body: JSON.stringify({
            uid: user_record["uid"],
            phoneNumber: user_record.phoneNumber,
            address: user_record["Address"],
            documentationVerified: user_record["Documentation Verified"]
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
      
        localStorage.removeItem("User Record");
        window.location.href = "./logoutPage.html";
    }
    else{
        window.location.href = "./user-auth-form.html";
    }
}
