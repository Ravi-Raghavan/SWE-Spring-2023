window.onload = startType(0,null);
function startType(code,value){
  
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
        loadPharmacies();
        if(code==1){
          document.getElementById("dmedication").value = value;
        }
      }
      if(ourType.toUpperCase() == "PATIENT"){
        document.querySelector(".main-boxone").className = document.querySelector(".main-boxone").className.substring(0,8);
        document.getElementById("email").value = getEmail();
        document.getElementById("fname").value = getFirstName();
        document.getElementById("lname").value = getLastName();
      }


    /**
    * Test Section Start
    */
    
    /**
    * Test Section End
    */
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
  if(names.length<2){
    return names[0];
  }else{
    return names[1];
  }
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
      /**
       * Code to add prescription start
       */
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
          validatePrescription("PATIENT",prescriptionNumber,null,null,null);
        }
      })
      /**
       * end
       */
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
  var pharmacy = document.querySelector(".pharmacy-options").value;
  if(pharmacy==""){
    alert("Please select a pharmacy!");
    return;
  }
  var refills = document.getElementById("drefills").value;
  if(refills==""){
    refills = 0;
  }
  if(!checkRefills(refills)){
    alert("refills provided is not a valid number!")
    return;
  }
  refills = Number(refills);
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
      fetch(`/prescription/get/drugs?drug=${medication}`,{
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
            refills:refills,
            prescriptionNumber:prescriptionNumber,
            instructions:instructions,
            uid:getUID(),
            pharmacy:pharmacy
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
              validatePrescription("DOCTOR",prescriptionNumber,demail,dfName,dlName);
            }
          })
        }else{
          /**
           * Medication error message display
           */
          medicationErrorDisplay();
          /**
           * Medication error message display
           */
        }
      })
    }else{
      alert("Prescription Number is Invalid!")
    }
  })
})

function medicationErrorDisplay(){
  document.querySelector(".main-box").className+="two";
          document.querySelector(".error-boxthree").className = document.querySelector(".error-boxthree").className.substring(0,9);
          fetch("/prescription/get/list",{
            method:"GET",
            cache:"no-cache"
          }).then((response)=>{
            response.json().then((result)=>{
              const P = result.Prescription;
              let PKeys = Object.keys(P);
              let Ptext = "";
              for(let i =0;i<PKeys.length;i++){
                Ptext += `<div class = "drug-item"><p>&#x2022; ${PKeys[i]}</p></div>`;
              }
              document.querySelector(".edit-right").innerHTML = Ptext;
              var drugs = document.querySelectorAll(".drug-item");
              drugs.forEach((drug)=>{
                drug.addEventListener("click",()=>{
                  let inText = drug.innerHTML;
                  inText = inText.substring(5,inText.length-4);
                  document.querySelector(".error-box").className += "three";
                  startType(1,inText);
                })
              })
            })
          })
}

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

function validatePrescription(accountType,prescriptionNumber,doctorEmail,doctorFirstName,doctorLastName){
  var sender = {
    prescriptionNumber:prescriptionNumber
  }
  fetch("/prescription/attempt/validation",{
    method:"POST",
    cache:"no-cache",
    body:JSON.stringify(sender)
  }).then((response) =>{
    console.log(response.status)
    if(response.status==301){
      if(accountType=="PATIENT"){
        document.querySelector(".main-box").className+="one";
        document.querySelector(".error-boxone").className = document.querySelector(".error-boxone").className.substring(0,9);
        document.querySelector(".link").addEventListener("click",()=>{
          document.querySelector(".link").classList.toggle("clicked");
          response.json().then((result)=>{
            let dE = result.dE;
            let dUID = result.dUID;
            var data = {
              pN:prescriptionNumber,
              dUID:dUID
            }
            /**
             * API to clean up database
             */
            fetch(`/prescription/remove/doctor`,{
              method:"POST",
              cache:"no-cache",
              body:JSON.stringify(data)
            })
            var emailData = {
              prescriptionNumber:prescriptionNumber,
              email:dE,
              accountType:"DOCTOR"
            };
            fetch("/prescription/send/error/email",{
              method: "POST",
              cache:"no-cache",
              body:JSON.stringify(emailData)
            })
          })
          window.location.href = "./submitted-prescription-patient-wait.html";
        })
      }else{
        document.querySelector(".main-box").className+="two";
        document.querySelector(".error-boxtwo").className = document.querySelector(".error-boxtwo").className.substring(0,9);
        document.querySelector(".linkd").addEventListener("click",()=>{
          document.querySelector(".linkd").classList.toggle("clicked");
          response.json().then((result)=>{
            let pE = result.pE;
            let pUID = result.pUID;
            var data ={
              pN:prescriptionNumber,
              pUID:pUID
            }
            /**
             * API to clean up database
             */
            fetch(`/prescription/remove/patient`,{
              method:"POST",
              cache:"no-cache",
              body:JSON.stringify(data)
            })
            var emailData = {
              prescriptionNumber:prescriptionNumber,
              email:pE,
              accountType:"PATIENT"
            };
            fetch("/prescription/send/error/email",{
              method: "POST",
              cache:"no-cache",
              body:JSON.stringify(emailData)
            })
          })
          window.location.href = "./submitted-prescription-doctor-wait.html";
        })
      }
    }else{
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
          response.json().then((result) =>{
            validatedPrescriptionEmail(result,doctorFirstName,doctorLastName,prescriptionNumber);
          })
          window.location.href = "./submitted-prescription-doctor-validated.html";
        }else{
          window.location.href = "./submitted-prescription-doctor-wait.html";
        }
      }
    }
  })
}

document.querySelector(".back-button-p").addEventListener("click",()=>{
  document.querySelector(".error-box").className+="one";
  startType(0,null);
})

document.querySelector(".back-button-d").addEventListener("click",()=>{
  document.querySelector(".error-box").className+="two";
  startType(0,null);
})

document.querySelector(".back-button-b").addEventListener("click",()=>{
  document.querySelector(".error-box").className+="three";
  startType(0,null);
})

function changeStatus(pN){
  var data = {
    prescriptionNumber:pN
  }
  fetch("/prescription/active",{
    method:"POST",
    cache:"no-cache",
    body:JSON.stringify(data)
  })
}

function validatedPrescriptionEmail(de,df,dl,pN){
  fetch(`/prescription/send/validated/email?email=${de}`,{
    method:"POST",
    cache:"no-cache",
    body : JSON.stringify({
      doctorFirstName:df,
      doctorLastName:dl,
      prescriptionNumber:pN
    })
  })
}

function checkRefills(refills){
  let signal = true;
  let set = new Set();
  set.add("1");
  set.add("2");
  set.add("3");
  set.add("4");
  set.add("5");
  set.add("6");
  set.add("7");
  set.add("8");
  set.add("9");
  set.add("0");
  for(let i = 0;i<refills.length;i++){
    if(!set.has(refills.charAt(i))){
      signal = false;
    }
  }
  return signal;
}

document.querySelector(".message span").addEventListener("click",()=>{
  window.location.href = "./contact-us.html";
})

function loadPharmacies(){
  fetch("/prescription/pharmacy/list",{
    method:"GET",
    cache:"no-cache"
  }).then((response)=>{
    response.json().then((result)=>{
      let innerAddition = `<option value="">Select Pharmacy</option>`;
      for(let i = 0;i<result.length;i++){
        let currPharm = result[i];
        innerAddition += `<option value="${currPharm.uid}">${currPharm.displayName} - ${currPharm.address}</option>`;
      }
      document.querySelector(".pharmacy-options").innerHTML = innerAddition;
    })
  })
}

