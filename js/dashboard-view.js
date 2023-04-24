async function logout() {
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

window.onload = async function () {
  document.querySelector(".text-field-container").classList.toggle("clicked");
  /**
   * Doctor Generate Prescription Tab
   */
  fetch(`/prescription/get/accountType?uid=${getUID()}`,{
    method: "GET",
    cache: "no-cache"
}).then((response) =>{
  var ourPromise = response.json();
  //console.log(ourPromise);
  ourPromise.then((result) =>{
    let ourType = result;
    if(ourType.toUpperCase() == "DOCTOR"){
    }
  })
})

//s

  //GET LIST OF USERS WITH NAMES OF THEIR DOCUMENTATION AS A JSON OBJECT
  let userDocumentation = await fetch(`/fetch/user/documentation`, {
    method: 'GET'
  })

  let userDocumentationJSON = await userDocumentation.json();
  var user_record = JSON.parse(localStorage.getItem("User Record"));

  for (var user in userDocumentationJSON){
    console.log("USER: " + user);
    var userInfo = userDocumentationJSON[user];
    var files = userInfo["files"];

    if (files != null){

      console.log("FILE DATA: " + JSON.stringify(files));

      var fileTitles = []
      var fileStatus = []

      for (var file in files){
        fileTitles.push(files[file]["name"])
        fileStatus.push(files[file]["status"])
      }

      if(user == user_record["uid"] ){
        for(i=0; i < fileTitles.length; i++){
          if(fileStatus[i] == "denied")
          addPrevFile(fileTitles[i].substring(fileTitles[i].indexOf('/')+1), 'D')

          else if(fileStatus[i] =="unverified")
          addPrevFile(fileTitles[i].substring(fileTitles[i].indexOf('/')+1), 'P')

          else
          addPrevFile(fileTitles[i].substring(fileTitles[i].indexOf('/')+1), 'A')
        }
      }


      addUserData(user, [1, 2, 3], [1, 2, 3], fileTitles, fileStatus)
    }
    
  }

  //////////

  loadProfile();
  //PORTION TO ADD SPECIAL FUNCTIONS TO DOCTOR ACCOUNTS
  if (localStorage.getItem("User Record") == null) {
    //
  } else {
    //USER RECORD DOES NOT HAVE AN ACCOUNT TYPE BEING LISTED IN THE JSON, FIX!!!!

    var user_record = JSON.parse(localStorage.getItem("User Record"));
    console.log(user_record);
    console.log("Account Type: " + user_record['Account Type']); 
    var uid = user_record["uid"];
    document.getElementById("uploadDocumentationForm").action = `/upload/documentation?uid=${uid}`;

    let response = await fetch(`/get/prescriptions/user?uid=${user_record["uid"]}`, {
      method: 'GET'
    })

    let responseStatus = response.status;
    let prescriptions = await response.json()
    console.log("Response Status: " + responseStatus);
    console.log("Prescription Data Fetched: " + JSON.stringify(prescriptions));

    if (responseStatus == 200){
      for (var prescriptionNumber in prescriptions){
        var prescription = prescriptions[prescriptionNumber];
        addPrescription(prescriptionNumber, [prescription.medication], prescription.doctorFirstName + " " + prescription.doctorLastName, "Valid");
      }
    }

    console.log("Going to Fetch Orders!");
    /**FETCH ORDERS */
    if (user_record["Account Type"] == "Delivery Driver"){

      console.log("For Delivery Drivers");
      let ordersResponse = await fetch(`/get/ready/orders`, {
        method: 'GET'
      })

      let ordersResponseStatus = ordersResponse.status;
      let orders = await ordersResponse.json();
  
      console.log("Response Status: " + ordersResponseStatus);
      console.log("Order Data Fetched: " + JSON.stringify(orders));

      if (ordersResponseStatus == 200){
        for (var userOrder in orders){
          for (var orderNumber in orders[userOrder]){
            console.log(orderNumber);
            var order = orders[userOrder][orderNumber];
            var drugs = []
            var quantities = []
            for (var drugNumber in order["drugs"]){
              var drug = order["drugs"][drugNumber];
              drugs.push(drug["title"]);
              quantities.push(parseInt(drug["quantity"]))
            }
    
            console.log(orderNumber);
            console.log(drugs);
            addDriverClaim(orderNumber, drugs, quantities, "ready");
          }
        }
      }
    }
    else{
      let ordersResponse = await fetch(`/get/orders/user?uid=${user_record["uid"]}`, {
        method: 'GET'
      })
  
      let ordersResponseStatus = ordersResponse.status;
      let orders = await ordersResponse.json();
      console.log("Response Status: " + ordersResponseStatus);
      console.log("Order Data Fetched: " + JSON.stringify(orders));
  
      if (ordersResponseStatus == 200){
        for (var orderNumber in orders){
          var order = orders[orderNumber];
          var drugs = []
          var quantities = []
          var orderStatus = order["status"];
          for (var drugNumber in order["drugs"]){
            var drug = order["drugs"][drugNumber];
            drugs.push(drug["title"]);
            quantities.push(parseInt(drug["quantity"]))
          }
  
          if (user_record['Account Type'] == "Pharmacy"){
            addPharmOrder(orderNumber, drugs, quantities);
          }
          else{
            addOrder(orderNumber, drugs, quantities, orderStatus);
          }
        }
      }
    }

    /**FETCH PAYMENT INFORMATION */
    let paymentCardResponse = await fetch(`/get/payment_cards?uid=${user_record['uid']}`, {method: "GET"})
    let paymentCardResponseJSON = await paymentCardResponse.json()

    console.log("Payment Card Response Status: " + paymentCardResponse.status);
    if (paymentCardResponse.status == 200){
      console.log("Payment Data Fetched: " + JSON.stringify(paymentCardResponseJSON));

      for (var paymentCardNumber in paymentCardResponseJSON){
        var paymentCard = paymentCardResponseJSON[paymentCardNumber]
        console.log("Payment Card: " + JSON.stringify(paymentCard));
        var name = paymentCard.name;

        var number = paymentCard.cardNumber;

        var address = paymentCard.address;
        var city = paymentCard.city;
        var state = paymentCard.state;
        var zip = paymentCard.zip;

        var expireM = paymentCard.expireM;
        var expireY = paymentCard.expireY;

        var rows = "<tr><td>"+name+"</td><td>---- ---- ---- "+number.substring(number.length-4)+"</td><td>"+address+", "+city+", "+state+", "+zip+"</td><td>"+expireM+" "+expireY+`</td><td><i class=\"fa fa-trash\" style=\"cursor: pointer;\" onclick  = \"removeInfo(this.parentNode.parentNode.rowIndex, ${number}, '${uid}')\"></i></td></tr>`;
        var table = document.getElementById("paymentList");
        var template = document.createElement('template');
        template.innerHTML = rows;
        table.append(template.content);
  
      }
    }

    //CURRENTLY APPLIES TO ALL ACCOUNTS. ONCE USER RECORD RETURNS ACCOUNT TYPE, REPLACE true WITH user_record.accountType == "Doctor"
    if(user_record["Account Type"] == "Doctor")
    {

      document.getElementById("loggingOut").remove();
      document.getElementById("DoctorPrescribedItems").innerText = "Claimed Prescriptions:";
      var rows = "<a id=\"approvalOption\"class=\"\"href=\"#\"onclick='swapDisplay(\"approval-info\", \"approvalOption\")'>Patient List</a>";
      var menu = document.getElementById("sideMenu");
      var template = document.createElement('template');
      template.innerHTML = rows;
      
      menu.appendChild(template.content);

      rows = `<a id="prescriptionNumberOption"
      class=""
      href="#"
      onclick='swapDisplay("request-prescription-number", "prescriptionNumberOption")'
      >Request Prescription Number</a>`;
      template.innerHTML = rows;
      menu.appendChild(template.content);

      rows = "<a id =\"loggingOut\" onclick=\"logout()\">Logout</a>";
      template.innerHTML = rows;
      menu.appendChild(template.content);
    }

    if(user_record["Account Type"] == "Admin")
    {

      document.getElementById("loggingOut").remove();
      var rows = "<a id=\"viewOption\" class=\"\" href=\"#\" onclick='swapDisplay(\"viewUser-info\", \"viewOption\")' >View Users</a>";
      var menu = document.getElementById("sideMenu");
      var template = document.createElement('template');
      template.innerHTML = rows;
      
      menu.appendChild(template.content);

      rows = "<a id =\"loggingOut\" onclick=\"logout()\">Logout</a>";
      template.innerHTML = rows;
      menu.appendChild(template.content);
    }

    if(user_record["Account Type"] == "Pharmacy") //Change this to patient to see addProducts.
    {

      document.getElementById("loggingOut").remove();
      var rows = "<a id=\"viewPharmOption\" class=\"\" href=\"#\" onclick='swapDisplay(\"pharm-info\", \"viewPharmOption\")' >View Pharmacy Order</a>";
      var menu = document.getElementById("sideMenu");
      var template = document.createElement('template');
      template.innerHTML = rows;
      
      menu.appendChild(template.content);

      rows = "<a id=\"addProductOption\" class=\"\" href=\"#\" onclick='swapDisplay(\"addProduct-info\", \"addProductOption\")' >Add Products</a>";
      template.innerHTML = rows;
      menu.appendChild(template.content);

      rows = "<a id =\"loggingOut\" onclick=\"logout()\">Logout</a>";
      template.innerHTML = rows;
      menu.appendChild(template.content);
    }
    
    

    
    if(user_record["Account Type"] === "Delivery Driver")
    {

      document.getElementById("loggingOut").remove();
      var rows = "<a id=\"claimOption\" class=\"\" href=\"#\" onclick='swapDisplay(\"claim-info\", \"claimOption\")' >Claim Orders</a>";
      var menu = document.getElementById("sideMenu");
      var template = document.createElement('template');
      template.innerHTML = rows;
      
      menu.appendChild(template.content);

      rows = "<a id =\"loggingOut\" onclick=\"logout()\">Logout</a>";
      template.innerHTML = rows;
      menu.appendChild(template.content);
    }
    
  }
};

function loadProfile(){
  document.getElementById("interface").innerHTML =
    document.getElementById("profile-info").innerHTML;
  if (localStorage.getItem("User Record") == null) {
    //
  } else {
    var user_record = JSON.parse(localStorage.getItem("User Record"));
    var profilePicture = user_record.photoURL;
    
    document.getElementById("profile-pic").src = profilePicture;
    document.getElementById("welcome-text").innerHTML =
      user_record.displayName;
    document.getElementById("full-name").innerHTML =
      user_record.displayName;
    document.getElementById("email").innerHTML = user_record.email;   
    document.getElementById("address").innerHTML = user_record["Address"];
    document.getElementById("phone").innerHTML = user_record.phoneNumber;
    document.getElementById("subStat").innerHTML = user_record["Subscription Plan"];

    document.getElementById("dropbtn").src = profilePicture;
    document.getElementById("dropbtn").style.filter = "none";
    document.getElementById("dropbtn").style.backgroundColor = "#8fc0e3";
    document.getElementById("dropbtn").style.width = "30px";
    document.getElementById("dropbtn").style.height = "30px";
  }

}

function swapDisplay(location, menuOption) {
  var links = document.getElementById("sideMenu").getElementsByTagName("a");
  for (i = 0; i < links.length; i++) {
    links[i].className = "";
  }
  document.getElementById("interface").innerHTML =
    document.getElementById(location).innerHTML;
  document.getElementById(menuOption).className = "active";

  if(menuOption == "infoOption")
    loadProfile();
}

async function removeInfo(x, number, uid){
  console.log(x);
  var row = document.getElementById("paymentList").rows[x]
  console.log(row);
  console.log(number);
  document.getElementById("paymentList").deleteRow(x);

  //DELETE CREDIT CARD FROM DATABASE
  let response = await fetch(`/delete/payment_card?cardNumber=${number}&uid=${uid}`, {
    method: 'DELETE',
  })

  console.log("Response Status: " + response.status);
  
}

//HELPER FUNCTION TO ADD ORDERS TO ORDER TABLE
//Params: Integer (Order Number), Array of Strings (List of Items and Quanitity), String (Order Status)
//Usage Example: addOrder(599212, ["Drug1 x2", "Drug2 x3"], "Delivered");
function addOrder(OrderNumber, ItemList, quantityList, Status){
  if(OrderNumber == null || ItemList == null || ItemList.length == 0||Status == null)
    return;
  
  else{
    var rows = '<tr><td>'+ String(OrderNumber) +'</td><td>';
      size = ItemList.length;
      for(i = 0; i < size; i++){
        rows = rows+(ItemList[i]);
        rows = rows + (` x${quantityList[i]}`)
        
        if(i != (size-1))
        rows= rows+ ( "<br>");
      }
      rows= rows +( '</td><td>'+Status+'</td></tr>');
      var table = document.getElementById('ordersList');
      var template = document.createElement('template');
      template.innerHTML = rows;
      console.log(rows);
      table.append(template.content);
      
      return;
  }
  
}

//HELPER FUNCTION TO ADD PHARM ORDERS TO PHARM ORDER TABLE TABLE
//Params: Integer (Order Number), Array of Strings (List of Items and Quanitity), Array of Numbers
//Usage Example: addOrder(599212, ["Drug1", "Drug2"], [1,2,3]);
function addPharmOrder(OrderNumber, ItemList, quantityList){
  if(OrderNumber == null || ItemList == null || ItemList.length == 0)
    return;
  
  else{
    var oid = String(OrderNumber);
    var rows = '<tr><td>'+ String(OrderNumber) +'</td><td>';
      size = ItemList.length;
      for(i = 0; i < size; i++){
        rows = rows+(ItemList[i]);
        rows = rows + (` x${quantityList[i]}`)
        
        if(i != (size-1))
        rows= rows+ ( "<br>");
      }
      rows= rows +( `</td><td><button class =\"dl-btn\" onclick = \"markReady(this.parentNode.parentNode.rowIndex, '${oid}')\" >Ready!</button></td></tr>`);
      var table = document.getElementById('pharmList');
      var template = document.createElement('template');
      template.innerHTML = rows;
      console.log(rows);
      table.append(template.content);
      
      return;
  }
  
}

function addDriverClaim(OrderNumber, ItemList, quantityList){
  if(OrderNumber == null || ItemList == null || ItemList.length == 0)
    return;
  
  else{
    var oid = String(OrderNumber);
    var rows = '<tr><td>'+ String(OrderNumber) +'</td><td>';
      size = ItemList.length;
      for(i = 0; i < size; i++){
        rows = rows+(ItemList[i]);
        rows = rows + (` x${quantityList[i]}`)
        
        if(i != (size-1))
        rows= rows+ ( "<br>");
      }
      rows= rows +( `</td><td><button class =\"dl-btn\"  onclick = \"markClaimed(this.parentNode.parentNode.rowIndex, '${oid}')\">Claim!</button></td></tr>`);
      var table = document.getElementById('claimList');
      var template = document.createElement('template');
      template.innerHTML = rows;
      console.log(rows);
      table.append(template.content);
      
      return;
  }
  
}

function addPrevFile(nameOfFile, Status){
  if(nameOfFile == null||Status == null || nameOfFile.length == 0)
    return;
  
  else{
    var rows = '<tr><td>'+ nameOfFile+'</td><td>';
      rows= rows +(Status+'</td></tr>');
      var table = document.getElementById('fileList');
      var template = document.createElement('template');
      template.innerHTML = rows;
      console.log(rows);
      table.append(template.content);
      
      return;
  }
  
}



//HELPER FUNCTION TO ADD USERS TO USER TABLE
//Params: Integer (UID), Array of Integers (Order Numbers), Array of Integers (Prescription Numbers), Array of Strings (File Titles)
//Usage Example: addUserData(599212, [123123, 13231], [2314, 2134123], ["test.jpg", "works.png"]);
function addUserData(UID, OrderNumbers, PrescriptionNumbers, fileTitles, fileStatus){
  var rows = "<tr onclick=\"showOrHide(this)\"> <td style = \"cursor: pointer;\">"+UID+"</td><td></td><td></td></tr>";
  var table = document.getElementById('userList');
  var template = document.createElement('template');
  template.innerHTML = rows;
  table.appendChild(template.content);

  rows = '<tr style=\"display: none;\"><td></td><td>';



  //fileTitles
  for(i = 0; i < fileTitles.length; i++){
    rows = rows + `<div onclick=\"rowListen(this, \'${UID}\')\"`;

    var status = fileStatus[i];
    
    //Change this depending on fileStatus.
    if (status == "denied"){
      rows = rows + 'style=\"cursor: pointer;color: #ff0000;\">';
    }
    else if (status == "unverified"){
      rows = rows + 'style=\"cursor: pointer;color: #ffa500;\">';
    }
    else if(status == "verified"){
      rows = rows + 'style=\"cursor: pointer;color: #008000;\">';
    }
    
    rows = rows + fileTitles[i] +'</div>';
    if(i != (fileTitles.length -1))
      rows = rows + ('<br>');
  }
  rows = rows + ('</td><td style = \"width=5%;\">');    

//Probably also have to add logic to check if user has already been verified or denied.

  //Verify Button
  rows = rows + `<button class =\"dl-btn\"onclick=\"verify(\'${UID}\')\">Verify</button>`
  //Deny Button
  rows = rows + `<button class =\"dl-btn-deny\"onclick=\"denyUser(\'${UID}\')\">Deny</button>`
  rows = rows + ('</td></tr>'); 

  

  table = document.getElementById('userList');
  template = document.createElement('template');
  template.innerHTML = rows;
  table.appendChild(template.content);

}

//HELPER FUNCTION TO ADD PRESCRIPTIONS TO PRESCRIPTION TABLE
//Params: Integer (Prescription Number), Array of Strings (List of Items and Quanitity), String (Name of Prescriber), String (Approval Status)
//Usage Example: addOrder(599212, ["Drug1 x2", "Drug2 x3"], "Dr. Doctor","Delivered");
function addPrescription(PrescriptionNumber, ItemList, PrescriberName, Approval){
  if(PrescriptionNumber == null || ItemList == null || ItemList.length == 0||PrescriberName == null || Approval == null)
    return;
  
  else{
    var rows = '<tr><td>'+ String(PrescriptionNumber) +'</td><td>';
      size = ItemList.length;
      for(i = 0; i < size; i++){
        rows = rows+(ItemList[i]);
        
        if(i != (size-1))
        rows= rows+ ( "<br>");
      }
      rows= rows +( '</td><td>'+PrescriberName+'</td><td>'+Approval+'</td></tr>');
      var table = document.getElementById('prescriptionList');
      var template = document.createElement('template');
      template.innerHTML = rows;
      console.log(rows);
      table.append(template.content);
      
      return;
  }
}

async function addCard(){
  document.getElementById("cvv").setCustomValidity("");


  var fname = document.getElementById("fname").value;
  var user_record = JSON.parse(localStorage.getItem("User Record"));
  var uid = user_record["uid"];
  var name = document.getElementById("cname").value;
  var email = document.getElementById("email").value;

  var number = document.getElementById("ccnum").value;

  var address = document.getElementById("adr").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var zip = document.getElementById("zip").value;

  var expireM = document.getElementById("expmonth").value;
  var expireY = document.getElementById("expyear").value;
  var cvv = document.getElementById("cvv").value;

  var invalidInput = false;

  //Validate State
  var States = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  if(state==null || !States.includes(state)){
    alert("Please Enter a Valid State!");
    document.getElementById("state").value = "";
    invalidInput = true;
  }

//Validate Zip Code      
regex = new RegExp(/^[0-9]{5}$/);
  if(zip == null || regex.test(zip)==false){
    alert("Please enter a valid Zip Code!");
    document.getElementById("zip").value = "";
    invalidInput = true;
  }
  //Test Validation for Credit Card Number (checks for a sequence of at least 15-16 numbers)
  number = number.replace(/\s/g, '');
  regex = new RegExp(/^[0-9]{15,16}$/);
  if(number == null || regex.test(number) == false){
    alert("Enter a valid Credit Card Number!");
    document.getElementById("ccnum").value="";
    invalidInput = true;
  }

  //Test Validation for Month
  var Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if(expireM== null || !Months.includes(expireM))
  {
    alert("Please Enter a valid Month!");
    document.getElementById("expmonth").value = "";
    invalidInput = true;
  }

  //Test Validation for Year (Checks for four digits right now)
  regex = new RegExp(/^[0-9]{4}$/);
  if(expireY == null || regex.test(expireY)==false){
    alert("Please enter a valid Year!");
    document.getElementById("expyear").value = "";
    invalidInput = true;
  }

  //Test Validation for CVV
  regex = new RegExp(/^[0-9]{3,4}$/);
  if(cvv == null || regex.test(cvv)==false){
    alert("Please enter a valid CVV!");
    document.getElementById("cvv").value = "";
    invalidInput = true;
  }

  if(invalidInput)
   return false;

  //Duplicate Checker
  let paymentCardResponse = await fetch(`/get/payment_cards?uid=${user_record['uid']}`, {method: "GET"})
  let paymentCardResponseJSON = await paymentCardResponse.json()
  console.log("Payment Card Response Status: " + paymentCardResponse.status);
  if (paymentCardResponse.status == 200){
    console.log("Payment Data Fetched: " + JSON.stringify(paymentCardResponseJSON));

    for (var paymentCardNumber in paymentCardResponseJSON){
      var paymentCard = paymentCardResponseJSON[paymentCardNumber]
      console.log("Payment Card: " + JSON.stringify(paymentCard));
      var testNumber = paymentCard.cardNumber;

      if(testNumber == number){
        alert("This card already exists!");
        invalidInput = true;
        return false;
      }
    }
  }
  var rows = "<tr><td>"+name+"</td><td>---- ---- ---- "+number.substring(number.length-4)+"</td><td>"+address+", "+city+", "+state+", "+zip+"</td><td>"+expireM+" "+expireY+`</td><td><i class=\"fa fa-trash\" style=\"cursor: pointer;\" onclick  = \"removeInfo(this.parentNode.parentNode.rowIndex, ${number}, '${uid}')\"></i></td></tr>`;
  var table = document.getElementById("paymentList");
  var template = document.createElement('template');
  template.innerHTML = rows;
  table.append(template.content);

  var paymentInformation = {"uid" : user_record.uid, "name": name, "cardNumber": number, "address": address, "city": city, "state": state, "zip": zip, "expireM": expireM, "expireY": expireY,  "expirationDate": `${expireM}/${expireY}`, "cvv": cvv}
  
  let response = await fetch('/add/payment_card', {
    method: 'PATCH',
    body: JSON.stringify(paymentInformation),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

  return false;
}
async function addressChange(){
  var user_record = JSON.parse(localStorage.getItem("User Record"));
  var text = prompt("Address: ", document.getElementById("address").innerText);
  if(text){
    document.getElementById("address").innerText = text;
    user_record['Address'] = text;
    let response = await fetch('/update/user', {
      method: 'PATCH',
      body: JSON.stringify({
        uid: user_record["uid"],
        phoneNumber: user_record.phoneNumber,
        address: user_record["Address"]
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
  else{

  }

  localStorage.setItem("User Record", JSON.stringify(user_record));
}
async function phoneNumberChange(){
  var user_record = JSON.parse(localStorage.getItem("User Record"));
  let text = prompt("Phone: ", document.getElementById("phone").innerText);
  if(text){
    document.getElementById("phone").innerText = text;
    user_record.phoneNumber = text;

    let response = await fetch('/update/user', {
      method: 'PATCH',
      body: JSON.stringify({
        uid: user_record["uid"],
        phoneNumber: user_record.phoneNumber,
        address: user_record["Address"]
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
  else{
    
  }

  localStorage.setItem("User Record", JSON.stringify(user_record));
}

async function deleteAccount(){
  var user_record = JSON.parse(localStorage.getItem("User Record"));
  var uid = user_record.uid;

  //DELETE User Account FROM DATABASE
  let response = await fetch(`/delete/account?uid=${uid}`, {
    method: 'DELETE',
  })

  console.log("Response Status: " + response.status);
  localStorage.removeItem("User Record");
  window.location.href = "./logoutPage.html";
}

var clicked;
var UID;
function rowListen(x, uid){
  clicked = x;
  UID = uid;
  document.getElementById("articleTitle").innerText = x.innerText;

  document.querySelector('.overlay').style.opacity = 1;
  document.querySelector('.overlay').style.visibility = "visible";

  var rgb = x.style.color.toString();

  rgb = rgb.substring(4, rgb.length-1)
           .replace(/ /g, '')
           .split(',');
  
  console.log(rgb);


  if( (rgb[0] == 0 && rgb[1] == 128 && rgb[2] == 0) || (rgb[0] == 255 && rgb[1] == 0 && rgb[2] == 0)){
    document.getElementById("accept").style.display = "none";
    document.getElementById("deny").style.display = "none";
    document.getElementById("download").style.display = "";
    if(rgb[0] == 0 && rgb[1] == 128 && rgb[2] == 0)
    document.getElementById("articleTitle").innerText = x.innerText + "\n\nVERIFIED!";

    else{
      document.getElementById("articleTitle").innerText = x.innerText + "\n\nDENIED!";
    }

  }

  else{
    document.getElementById("accept").style.display = "";
    document.getElementById("deny").style.display = "";
    document.getElementById("download").style.display = "";
  }
  
}

async function accept(){
clicked.style.color = "#008000";

var uid = UID;
var file_name = clicked.innerText;
var file_status = "verified";

var data = {
  uid: uid,
  file_name: file_name, 
  file_status: file_status
}
exit();

let response = await fetch('/update/documentation/status', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
})
}

async function deny(){
clicked.style.color = "#ff0000";

var uid = UID;
var file_name = clicked.innerText;
var file_status = "denied";

var data = {
  uid: uid,
  file_name: file_name, 
  file_status: file_status
}

exit();

let response = await fetch('/update/documentation/status', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
})


}

//This Function is used to download stuff from the server
async function test(){
//alert("HERE");
var file_name = clicked.innerText;
console.log("FILE NAME: " + file_name);

let response = await fetch(`/download/file?file_name=${file_name}`, {method: 'GET'})
let response_blob = await response.blob()

//MAKE PDF CLIENT SIDE 
const link = document.createElement('a');
// create a blobURI pointing to our Blob
link.href = URL.createObjectURL(response_blob);
link.download = `${file_name}`;
// some browser needs the anchor to be in the doc
document.body.append(link);
link.click();
link.remove();
}

async function downloadOrders(){
//Step 1 is to get the current User UID
var user_record = JSON.parse(localStorage.getItem("User Record"));
var uid = user_record.uid;

//GET REQUEST TO SERVER TO FETCH PDF DATA. 
let response = await fetch(`/download/orders?uid=${uid}`, {method: 'GET'})
let response_blob = await response.blob();

//MAKE PDF CLIENT SIDE 
const link = document.createElement('a');
// create a blobURI pointing to our Blob
link.href = URL.createObjectURL(response_blob);
link.download = `${uid}-orders.pdf`;
// some browser needs the anchor to be in the doc
document.body.append(link);
link.click();
link.remove();
}

async function downloadPrescriptions(){
  //Step 1 is to get the current User UID
var user_record = JSON.parse(localStorage.getItem("User Record"));
var uid = user_record.uid;

//GET REQUEST TO SERVER TO FETCH PDF DATA. 
let response = await fetch(`/download/prescriptions?uid=${uid}`, {method: 'GET'})
let response_blob = await response.blob();

//MAKE PDF CLIENT SIDE 
const link = document.createElement('a');
// create a blobURI pointing to our Blob
link.href = URL.createObjectURL(response_blob);
link.download = `${uid}-prescriptions.pdf`;
// some browser needs the anchor to be in the doc
document.body.append(link);
link.click();
link.remove();
}

async function verify(UID){
var user_record = JSON.parse(localStorage.getItem("User Record"));
let response = await fetch('/update/user', {
  method: 'PATCH',
  body: JSON.stringify({
    uid: UID,
    phoneNumber: user_record.phoneNumber,
    address: user_record["Address"],
    documentationVerified: true
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

}

async function denyUser(UID){
  var user_record = JSON.parse(localStorage.getItem("User Record"));
let response = await fetch('/update/user', {
  method: 'PATCH',
  body: JSON.stringify({
    uid: UID,
    phoneNumber: user_record.phoneNumber,
    address: user_record["Address"],
    documentationVerified: false
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
}

//MARK ORDER AS READY FOR DELIVERY
async function markReady(rowIndex, OID){
  var user_record = JSON.parse(localStorage.getItem("User Record"));

  let response = await fetch('/ready/order', {
    method: 'PATCH',
    body: JSON.stringify({
      oid: OID,
      pid: user_record.uid
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

  var row = document.getElementById("pharmList").rows[parseInt(rowIndex)]
  console.log(row);
  document.getElementById("pharmList").deleteRow(parseInt(rowIndex));
}

async function markClaimed(rowIndex, OID){
  var user_record = JSON.parse(localStorage.getItem("User Record"));

  let response = await fetch('/claim/order', {
    method: 'PATCH',
    body: JSON.stringify({
      oid: OID
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

  var row = document.getElementById("claimList").rows[parseInt(rowIndex)]
  console.log(row);
  document.getElementById("claimList").deleteRow(parseInt(rowIndex));
}

function exit(){
  document.querySelector('.overlay').style.opacity = 0;
  document.querySelector('.overlay').style.visibility = "hidden";
}

function getUID(){
if(localStorage.getItem("User Record")==null){
  alert("Please create an account / log in, to add a prescription. Thank You!");
}else{
  var user_record = JSON.parse(localStorage.getItem("User Record"));
  var uid = user_record.uid;
  return uid;
}
}

function getEmail(){
if(localStorage.getItem("User Record")==null){
  alert("Please create an account / log in, to add a prescription. Thank You!");
}else{
  var user_record = JSON.parse(localStorage.getItem("User Record"));
  var email = user_record.email;
  return email;
}
}

function addSideBarItem(){
var innerStuff = document.getElementById("sideMenu").innerHTML;
//console.log(innerStuff);
//console.log(innerStuff.substring(0,460));
//console.log(innerStuff.substring(460));
let temp = `<a id="prescriptionNumberOption"
class=""
href="#"
onclick='swapDisplay("request-prescription-number", "prescriptionNumberOption")'
>Request Prescription Number</a>`;
var finalStuff = innerStuff.substring(0,460) + temp + innerStuff.substring(460);
document.getElementById("sideMenu").innerHTML = finalStuff;
}

function sendPrescriptionNumber(){
document.querySelector(".my-button").classList.toggle("clicked");
document.querySelector(".text-field-container").classList.toggle("clicked");
fetch("/html/random/prescription",{
  method:"GET",
  cache:"no-cache"
}).then((response)=>{
  response.json().then((result)=>{
    emailFunction(result.item);
  })
})
}

function emailFunction(prescriptionNumber){
let email = getEmail();
let dataToSend = {
  doctorEmail:email,
  prescriptionNumber:prescriptionNumber
}
fetch("prescription/request/email",{
  method:"POST",
  cache:"no-cache",
  body:JSON.stringify(dataToSend)
}).then(()=>{
  window.location.href = "./requestPrescriptionNumberConfirmation.html";
})
}

function addAProduct(){
  const btnSubmit = document.getElementById("submitButton");
  const txtName = document.getElementById("txtName");
  const numLimit = document.getElementById("numLimit");
  const numPrice = document.getElementById("numPrice");
  const boxPrescription = document.getElementById("boxPrescription");
  const f = document.getElementById("f");
  const reader = new FileReader();
  const file = f.files[0];
  const usePlaceholder = f.files.length === 0;

  if(!txtName.value || !numLimit.value || !numPrice.value) {
    console.log('fill out all fields'); // how do we make this look nice???
    return;
  }

  const productInfo = {
    filename: (!usePlaceholder ? file.name : 'placeholder.png'),
    limit: parseInt(numLimit.value),
    name: txtName.value,
    price: parseFloat(numPrice.value),
    requiresPrescription: boxPrescription.checked,
  };
  
  console.log(productInfo);
  fetch("/products/create", {
    method: 'POST',
    body: JSON.stringify(productInfo)
  })
  .then((res) => {
    if(res.status === 201) {
        /* We are good. */
        console.log('affirmation goes here');

        /* This takes care of file upload, if the file was uploaded to begin with */
        if(!usePlaceholder) {
            reader.onload = async ev => {
                const CHUNK_SIZE = 8192;
                const chunkCount = ev.target.result.byteLength / CHUNK_SIZE;

                console.log("Read successfully");
                const fileName = file.name;
                for (let chunkId = 0; chunkId < chunkCount + 1; chunkId ++ )
                {
                    const chunk = ev.target.result.slice(chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE );
                    await fetch ("/products/receiveProductImage", {
                        "method": "POST",
                        "headers": {
                            "content-type": "application/octet-stream",
                            "content-length": chunk.length,
                            "filename": fileName
                        },
                        "body": chunk
                    });
                    // divOutput.textContent = Math.round(chunkId * 100/chunkCount,0) + "%"
                }
                // console.log(ev.target.result.byteLength);
            }
            reader.readAsArrayBuffer(file);
            fetch("/products/refreshImg", {
                method: 'PATCH'
            })
        }
    }else {
      /* there has been some problem */
      res.json().then((data) => {
          // console.log(`The error is as follows: ${data}`);
          console.log(data);
      });
  }
})

  
}