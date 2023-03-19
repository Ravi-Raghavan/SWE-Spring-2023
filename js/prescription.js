

window.onload = startType();

function startType(){
  var userID = getUID();
  fetch("/prescription/accountType",{
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(userID)
  }).then((response) =>{
    var ourPromise = response.json();
    //console.log(ourPromise);
    ourPromise.then((result) =>{
      let ourType = result.type;
      if(ourType.toUpperCase() == "DOCTOR"){
        document.querySelector(".main-boxtwo").className = document.querySelector(".main-boxtwo").className.substring(0,8);
      }
      if(ourType.toUpperCase() == "PATIENT"){
        document.querySelector(".main-boxone").className = document.querySelector(".main-boxone").className.substring(0,8);
      }
    })
  })
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

console.log(getUID());
console.log(getEmail());

document.querySelector(".acknowledgement-box").addEventListener("click",() =>{
  document.querySelector(".acknowledgement-box").classList.toggle("clicked");
  document.querySelector(".title-next-next").classList.toggle("next");
})

document.querySelector(".acknowledgement-box-doctor").addEventListener("click",() =>{
  document.querySelector(".acknowledgement-box-doctor").classList.toggle("clicked");
  document.querySelector(".title-next-next-doctor").classList.toggle("next");
})


document.querySelector(".submit-box1").addEventListener("click", () =>{
  let classNameLabel = document.querySelector(".acknowledgement-box").className;
  if(classNameLabel.charAt(classNameLabel.length-1)!="d"){
    alert("Please click the button above to acknowledge that all boxes are accurately filled");
    return;
  }
  var currentUID = getUID();
  var firstName = document.getElementById("fname").value;
  if(!checkName(firstName)){
    return;
  }
  var lastName = document.getElementById("lname").value;
  if(!checkName(lastName)){
    return;
  }
  var email = document.getElementById("email").value;
  if(!checkEmail(email)){
    return;
  }
  var issueDate = document.getElementById("rd").value;
  if(!checkDate(issueDate)){
    return;
  }
  var dateOfBirth = document.getElementById("dob").value;
  if(!checkDate(dateOfBirth)){
      return;
  }
  var prescriptionNumber = document.getElementById("DOB").value;
  let fullName = firstName+" "+lastName;
  //console.log(fullName.toUpperCase());
  let setHappened = false;
  if(getEmail() == email){
    var data = {
      dateOfBirth: dateOfBirth,
      firstName: firstName.toUpperCase(),
      issueDate: issueDate,
      lastName: lastName.toUpperCase(),
      patientEmail:email,
      patientUID: currentUID,
      prescriptionNumber:prescriptionNumber,
    }
    fetch("/make/patientPrescription",{
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(data)
    }).then((response)=>{
      console.log(response.json());
      if(response.status == 201){
        console.log("prescription added");
        window.location.href = "./submitted-prescription-patient.html";
      }else{
        console.log("prescription not added");
      }
    })
    /*set(ref(db,"patientPrescriptions/"+foundUSERID+"/"),{
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      patientEmail:email,
      issueDate: issueDate,
      dateOfBirth: dateOfBirth,
      prescriptionNumber:prescriptionNumber,
      patientUID: currentUID
    })*/
    setHappened = true;
    if(setHappened==false){
      alert("The email provided in the form does not match the email address of this account! Patients may only request prescriptions to their own account.");
    }
  }
})

document.querySelector(".submit-box2").addEventListener("click",()=>{
  let classNameLabel = document.querySelector(".acknowledgement-box-doctor").className;
  if(classNameLabel.charAt(classNameLabel.length-1)!="d"){
    alert("Please click the button above to acknowledge that all boxes are accurately filled");
    return;
  }
  var currentUID = getUID();
  var patientFirstName = document.getElementById("dpfname").value;
  var patientLastName = document.getElementById("dplname").value;
  var patientDOB = document.getElementById("dpatientDateOfBirth").value;
  var doctorFirstName = document.getElementById("dfname").value;
  var doctorLastName = document.getElementById("dlname").value;
  var doctorAccountEmail = document.getElementById("demail").value;
  var issueDate = document.getElementById("dDOB").value;
  var expireDate = document.getElementById("drd").value;
  var medication = document.getElementById("dmedication").value;
  var dosage = document.getElementById("ddosage").value;
  var refills = document.getElementById("drefills").value;
  var prescriptionNumber = document.getElementById("dprescriptionNumber").value;
  var instructions = document.getElementById("dinstructions").value; 
  //console.log("hi");
  //console.log("hi".toUpperCase());
  //console.log("hi342lksdj".toUpperCase());
  if(!checkName(patientFirstName)){
    return;
  }
  if(!checkName(patientLastName)){
    return;
  }
  if(!checkDate(patientDOB)){
    return;
  }
  if(!checkName(doctorFirstName)){
    return;
  }
  if(!checkName(doctorLastName)){
    return;
  }
  if(!checkEmail(doctorAccountEmail)){
    return;
  }
  if(!checkDate(issueDate)){
    return;
  }
  if(!checkDate(expireDate)){
    return;
  }
  if(!checkMeasurement(dosage)){
    alert("Please add measurement units after the dosage amount. Ex: mg, g, ml");
    return;
  }
  if(!checkRefills(refills)){
    return;
  }
  let setHappened = false;
      if(getEmail() == doctorAccountEmail){
        var data = {
          dateOfBirth: patientDOB,
          doctorEmail: doctorAccountEmail,
          doctorFirstName: doctorFirstName.toUpperCase(),
          doctorLastName: doctorLastName.toUpperCase(),
          doctorUID: currentUID,
          dosage: dosage,
          expireDate: expireDate,
          instructions: instructions,
          issueDate: issueDate,
          medication: medication.toUpperCase(),
          patientFirstName: patientFirstName.toUpperCase(),
          patientLastName: patientLastName.toUpperCase(),
          prescriptionNumber: prescriptionNumber,
          refills: refills
        }
        fetch("/make/doctorPrescription",{
          method: "POST",
          cache: "no-cache",
          body: JSON.stringify(data)
        }).then((response) => {
          console.log(response.json());
          if(response.status == 201){
            console.log("all good :)");
            window.location.href = "./submitted-prescription-patient.html";
        }else{
            console.log("not good :(");
        }
        })
        /**set(ref(db,"doctorPrescriptions/"+foundUSERID+"/"),{
          patientFirstName: patientFirstName.toUpperCase(),
          patientLastName: patientLastName.toUpperCase(),
          dateOfBirth: patientDOB,
          doctorFirstName: doctorFirstName.toUpperCase(),
          doctorLastName: doctorLastName.toUpperCase(),
          doctorEmail: doctorAccountEmail,
          issueDate: issueDate,
          expireDate: expireDate,
          medication: medication.toUpperCase(),
          dosage: dosage,
          refills: refills,
          prescriptionNumber: prescriptionNumber,
          instructions: instructions,
          doctorUID: currentUID
        })*/
        setHappened = true;
        }
      if(setHappened==false){
        alert("The email provided in the form does not match the email address of this account! Doctors many only fill prescriptions to their own accounts.")
      }
})


function checkRefills(refills){
  if(refills==""){
    alert("Refills: is empty.")
    return false;
  }
  var numSet = new Set(["1","2","3","4","5","6","7","8","9","0"]);
  for(let i = 0;i<refills.length;i++){
    if(!numSet.has(refills.charAt(i))){
      alert("Refills must be a valid number");
      return false;
    }
  }
  return true;
}

function checkEmail(email){
  if(email==""){
    alert("Account email: is empty.")
    return false;
  }
  let foundAt = 0;
  let foundPeriod = 0;
  for(let i = 0;i<email.length;i++){
    if(email.charAt(i)=="@"){
      foundAt++;
    }
    if(email.charAt(i)=="."){
      foundPeriod++;
    }
  }
  if(foundPeriod>=1 && foundAt==1){
    return true;
  }else{
    alert("invalid email format");
    return false;
  }
}

function checkName(name){
  if(name==""){
    alert("Name Box: is empty.")
    return false;
  }
  for(let i = 0;i<name.length;i++){
    if(name.charAt(i)==" "){
      alert("There must not be any spaces in any names");
      return false;
    }
  }
  return true;
}

function checkMeasurement(dosage){
  var numSet = new Set(["1","2","3","4","5","6","7","8","9","0"]);
  let hasNonNumber = false;
  for(let i = 0;i<dosage.length;i++){
    if(!numSet.has(dosage.charAt(i))){
      hasNonNumber = true;
    }
  }
  if(hasNonNumber){
    return true;
  }else{
    return false;
  }
}

function checkDate(date){
  if(date==""){
    alert("Date Box: is empty.")
    return false;
  }
  if(date.length<10){
    alert("Date must be in the correct format: MM/DD/YYYY");
    return false;
  }
  if(date.charAt(2)!="/"){
    alert("Date must be in the correct format: MM/DD/YYYY");
    return false;
  }
  if(date.charAt(5)!="/"){
    alert("Date must be in the correct format: MM/DD/YYYY");
    return false;
  }
  
  var numSet = new Set(["1","2","3","4","5","6","7","8","9","0"]);
  for(let i = 0;i<date.length;i++){
    if(i!=2 && i!=5){
      if(!numSet.has(date.charAt(i))){
        alert("Date must only contain numbers and slashes: MM/DD/YYYY");
        return false;
      }
    }
  }
  return true;
}

