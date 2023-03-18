function handleUserManagingAccount(){
    //If user is not logged in, display alert and go back
    if (localStorage.getItem("User Record") == null){
        alert("Please Create an Account");
    }
    else{
        window.location.href = '../html/dashboard.html';
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

function login_logout(){
    var innerText = document.getElementById("Link6").innerHTML
    if (innerText == "Log Out"){
        localStorage.removeItem("User Record");
        window.location.href = "./logoutPage.html"
    }
    else{
        window.location.href = "./user-auth-form.html";
    }
}
window.onload = function(){
    if (localStorage.getItem("User Record") == null){
        document.getElementById("Link6").innerHTML = "Log In";
    }
    else{
        var user_record = JSON.parse(localStorage.getItem("User Record"));
        var profilePicture = user_record.photoURL
        document.getElementById("dropbtn").src = profilePicture
    }
}