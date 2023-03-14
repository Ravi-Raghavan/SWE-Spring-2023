import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyAD8RODlLg_BCHxy3ghN91W5XxIvPLbAp4",
  authDomain: "swe-spring-2023.firebaseapp.com",
  databaseURL: "https://swe-spring-2023-default-rtdb.firebaseio.com",
  projectId: "swe-spring-2023",
  storageBucket: "swe-spring-2023.appspot.com",
  messagingSenderId: "600915655715",
  appId: "1:600915655715:web:966a0affd54b6df2478596",
  measurementId: "G-EW7N8BG805"
};
try{
  const app = initializeApp(firebaseConfig);
}catch{
  alert("hi1");
}
try{
  const analytics = getAnalytics(app);
}catch{
  console.log("error getting analytics");
}
import{getDatabase,ref,get,set,child,update,remove} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
const db = getDatabase();
function getUID(){
  if(localStorage.getItem("User Record")==null){
    alert("Please create an account / log in, to add a prescription. Thank You!");
  }else{
    var user_record = JSON.parse(localStorage.getItem("User Record"));
    var uid = user_record.uid;
    return uid;
  }
}

document.querySelector(".submit-box1").addEventListener("click", () =>{
  
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
  
  const dbref = ref(db);
  get(child(dbref,"users/")).then((snapshot)=>{
      if(snapshot.exists()){
                    let userIDS = Object.keys(snapshot.val());
                    let userObject = Object.values(snapshot.val());
                    let setHappened = false;
                    for(let i = 0;i<userIDS.length;i++){
                        let grabName = userObject[i].displayName.toUpperCase();
                        let grabEmail = userObject[i].email;
                        let grabType = userObject[i].accountType.toUpperCase();
                        //console.log(grabType);
                        if(grabEmail == email){
                          let foundType = grabType;
                          if(grabType=="DOCTOR"){
                            alert("The email provided is registered as a doctor, Please fill out the Doctor Prescription Form");
                            return;
                          }
                          let foundUSERID = userIDS[i];
                          //console.log(foundUSERID);
                          if(foundUSERID!=currentUID){
                            alert("Make sure all form credentials are correct. Users may only request a prescription for their own accounts.");
                            return;
                          }
                          set(ref(db,"patientPrescriptions/"+foundUSERID+"/"),{
                            firstName: firstName.toUpperCase(),
                            lastName: lastName.toUpperCase(),
                            patientEmail:email,
                            issueDate: issueDate,
                            dateOfBirth: dateOfBirth,
                            prescriptionNumber:prescriptionNumber,
                            patientUID: currentUID
                          })
                          setHappened = true;
                          window.location.href = "./submitted-prescription-patient.html";
                        }
                    }
                    if(setHappened==false){
                      alert("Credentials do not match any registered account. Thank You!");
                    }
                }else{
                   alert("Please create an account / log in, to add a prescription. Thank You!");
                }
    })
})

document.querySelector(".submit-box2").addEventListener("click",()=>{
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
  
  const dbref = ref(db);
  get(child(dbref,"users/")).then((snapshot)=>{
    if(snapshot.exists()){
    let userIDS = Object.keys(snapshot.val());
    let userObject = Object.values(snapshot.val());
    let setHappened = false;
    for(let i = 0;i<userIDS.length;i++){
      let grabName = userObject[i].displayName.toUpperCase();
      let grabEmail = userObject[i].email;
      let grabType = userObject[i].accountType.toUpperCase();
      if(grabEmail == doctorAccountEmail){
        let foundType = grabType;
          if(grabType=="PATIENT"){
            alert("You are registered as a patient, Please fill out the Patient Prescription Form");
            return;
          }
        let foundUSERID = userIDS[i];            
        if(foundUSERID!=currentUID){
          alert("Make sure all form credentials are correct. Doctors may only fill a prescription linked to their own accounts.");
          return;
        }
        set(ref(db,"doctorPrescriptions/"+foundUSERID+"/"),{
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
        })
        setHappened = true;
        window.location.href = "./submitted-prescription-patient.html";
        }
        }
        if(setHappened==false){
          alert("Credentials do not match any registered account. Thank You!");
        }
        }else{
          alert("Please create an account / log in, to add a prescription. Thank You!");
        }
    })

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

