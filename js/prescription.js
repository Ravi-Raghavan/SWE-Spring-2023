window.onload = startType();
function startType(){
  var userID = {
    uid: getUID()
  };
    fetch(`/prescription/get/accountType?uid=${getUID()}`,{
      method: "GET",
      cache: "no-cache"
  }).then((response) =>{
    var ourPromise = response.json();
    //console.log(ourPromise);
    ourPromise.then((result) =>{
      let ourType = result;
      if(ourType.toUpperCase() == "DOCTOR"){
        document.querySelector(".main-boxtwo").className = document.querySelector(".main-boxtwo").className.substring(0,8);
        document.getElementById("demail").value = getEmail();
        document.getElementById("dfname").value = getFirstName();
        document.getElementById("dlname").value = getLastName();
      }
      if(ourType.toUpperCase() == "PATIENT"){
        document.querySelector(".main-boxone").className = document.querySelector(".main-boxone").className.substring(0,8);
        document.getElementById("email").value = getEmail();
        document.getElementById("fname").value = getFirstName();
        document.getElementById("lname").value = getLastName();
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

function getName(){
  if(localStorage.getItem("User Record")==null){
    alert("Please create an account / log in, to add a prescription. Thank You!");
  }else{
    var user_record = JSON.parse(localStorage.getItem("User Record"));
    var name = user_record.displayName;
    return name;
  }
}

function getFirstName(){
  var name = getName();
  const names = name.split(" ");
  return names[0];
}

function getLastName(){
  var name = getName();
  const names = name.split(" ");
  return names[1];
}

document.querySelector(".acknowledgement-box").addEventListener("click",() =>{
  document.querySelector(".acknowledgement-box").classList.toggle("clicked");
  document.querySelector(".title-next-next").classList.toggle("next");
})

document.querySelector(".acknowledgement-box-doctor").addEventListener("click",() =>{
  document.querySelector(".acknowledgement-box-doctor").classList.toggle("clicked");
  document.querySelector(".title-next-next-doctor").classList.toggle("next");
})

/**
 * Patient Side
 */
document.querySelector(".submit-box1").addEventListener("click",() =>{
  var pfName = document.getElementById("fname").value;
  var plName = document.getElementById("lname").value;
  var pemail = document.getElementById("email").value;
  var pdob = document.getElementById("patientDateOfBirth").value;
  if(pdob==""){
    alert("Date is empty!");
    return;
  }
  const dateArray = pdob.split("-");
  pdob = dateArray[1]+"/"+dateArray[2]+"/"+dateArray[0];
  var prescriptionNumber = document.getElementById("prescriptionNumber").value;
  if(prescriptionNumber==""){
    alert("Prescription Number is empty!");
    return;
  }
  if(!pAckClicked("PATIENT")){
    alert("Please click the acknowledgement box before submitting");
    return;
  }
  fetch(`/prescription/check/prescriptionNumber?prescriptionNumber=${prescriptionNumber}`,{
    method:"GET",
    cache:"no-cache"
  }).then((response)=>{
    if(response.status==200){
      var patientPrescriptionPackage ={
        firstName:pfName.toUpperCase(),
        lastName:plName.toUpperCase(),
        patientEmail:pemail,
        patientDOB:pdob,
        prescriptionNumber:prescriptionNumber,
        uid:getUID()
      };
      fetch(`/prescription/add/patient`,{
        method:"POST",
        cache:"no-cache",
        body:JSON.stringify(patientPrescriptionPackage)
      }).then((response)=>{
        if(response.status==200){
          /**
           * If prescription is added successfully ---> do some action below
           */
          validatePrescription("PATIENT",prescriptionNumber);
        }
      })
    }else{
      alert("Prescription Number is Invalid!")
    }
  })
})


/**
 * Doctor side
 */
document.querySelector(".submit-box2").addEventListener("click",() =>{
  var pfName = document.getElementById("dpfname").value;
  var plName = document.getElementById("dplname").value;
  if(pfName==""){
    alert("Patient First Name is Empty!");
    return;
  }
  if(plName==""){
    alert("Patient Last Name is Empty!");
    return;
  }
  var pdob = document.getElementById("dpatientDateOfBirth").value;
  if(pdob==""){
    alert("Patient Date of Birth is empty!");
    return;
  }
  const dateArray = pdob.split("-");
  pdob = dateArray[1]+"/"+dateArray[2]+"/"+dateArray[0];
  var dfName = document.getElementById("dfname").value;
  var dlName = document.getElementById("dlname").value;
  var demail = document.getElementById("demail").value;
  var dexpiredate = document.getElementById("dexpireDate").value;
  if(dexpiredate==""){
    alert("Prescription Expiration Date is Empty!");
    return;
  }
  const eDateArray = dexpiredate.split("-");
  dexpiredate = eDateArray[1]+"/"+eDateArray[2]+"/"+eDateArray[0];
  var medication = document.getElementById("dmedication").value;
  if(medication==""){
    alert("Medication Not Specified!");
    return;
  }
  var dosage = document.getElementById("ddosage").value;
  if(dosage==""){
    alert("Dosage Not Specified!");
    return;
  }
  var refills = document.getElementById("drefills").value;
  if(refills==""){
    refills = 0;
  }
  var prescriptionNumber = document.getElementById("dprescriptionNumber").value;
  if(prescriptionNumber==""){
    alert("Prescription Number is empty!");
    return;
  }
  var instructions = document.getElementById("dinstructions").value;
  if(instructions==""){
    instructions = "none";
  }
  if(!pAckClicked("DOCTOR")){
    alert("Please click the acknowledgement box before submitting");
    return;
  }
  fetch(`/prescription/check/prescriptionNumber?prescriptionNumber=${prescriptionNumber}`,{
    method:"GET",
    cache:"no-cache"
  }).then((response)=>{
    if(response.status==200){
      var doctorPrescriptionPackage = {
        patientFirstName:pfName.toUpperCase(),
        patientLastName:plName.toUpperCase(),
        patientDOB:pdob,
        doctorFirstName:dfName.toUpperCase(),
        doctorLastName:dlName.toUpperCase(),
        doctorAccountEmail:demail,
        expireDate:dexpiredate,
        medication:medication,
        dosage:dosage,
        refills:refills,
        prescriptionNumber:prescriptionNumber,
        instructions:instructions,
        uid:getUID()
      }
      fetch("/prescription/add/doctor",{
        method:"POST",
        cache:"no-cache",
        body:JSON.stringify(doctorPrescriptionPackage)
      }).then((response)=>{
        if(response.status==200){
          /**
           * If prescription is added successfully ---> do some action below
           */
          validatePrescription("DOCTOR",prescriptionNumber);
        }
      })
    }else{
      alert("Prescription Number is Invalid!")
    }
  })
})

function pAckClicked(accountType){
  if(accountType=="PATIENT"){
    let ackStatus = document.querySelector(".acknowledgement-box").className;
    if(ackStatus=="acknowledgement-box clicked"){
      return true;
    }else{
      return false;
    }
  }else{
    let ackStatus = document.querySelector(".acknowledgement-box-doctor").className;
    if(ackStatus=="acknowledgement-box-doctor clicked"){
      return true;
    }else{
      return false;
    }
  }
}

function validatePrescription(accountType,prescriptionNumber){
  fetch("/prescription/attempt/validation",{
    method:"POST",
    cache:"no-cache"
  }).then((response) =>{
    console.log(response.status);
    if(accountType=="PATIENT"){
      if(response.status==200){
        changeStatus(prescriptionNumber);
        window.location.href = "./submitted-prescription-patient-validated.html";
      }else{
        window.location.href = "./submitted-prescription-patient-wait.html";
      }
    }else{
      if(response.status==200){
        changeStatus(prescriptionNumber);
        window.location.href = "./submitted-prescription-doctor-validated.html";
      }else{
        window.location.href = "./submitted-prescription-doctor-wait.html";
      }
    }
  })
}


function changeStatus(pN){
  var data = {
    prescriptionNumber:pN
  }
  fetch("/prescription/active",{
    method:"POST",
    cache:"no-cache",
    body:JSON.stringify(data)
  }).then((reponse)=>{
    
  })
}

  

