function handleUserManagingAccount(){
    if (localStorage.getItem("User Record") == null){
        var url_stack = ['./user-auth-form.html', './dashboard.html']
        var json_data = {url_stack: url_stack}
        localStorage.setItem("URL Stack", JSON.stringify(json_data))
        window.location.href = './user-auth-form.html'
    }
    else{
        window.location.href = './dashboard.html'
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