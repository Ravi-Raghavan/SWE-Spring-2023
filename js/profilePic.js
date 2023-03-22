window.onload = function () {
  if (localStorage.getItem("User Record") == null) {
    document.getElementById("Link6").innerHTML = "Log In";
  } else {
    var user_record = JSON.parse(localStorage.getItem("User Record"));
    var profilePicture = user_record.photoURL;
      document.getElementById("dropbtn").src = profilePicture;
      document.getElementById("dropbtn").style.filter = "none";
      document.getElementById("dropbtn").style.backgroundColor = "#8fc0e3"; 
  }
};
