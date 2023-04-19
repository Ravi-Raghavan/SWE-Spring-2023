window.onload = function (){
    let send = {
        uid:getUID()
    }
    fetch(`/prescription/dropdown/patient?type=${"patient"}`,{
        method:"POST",
        cache:"no-cache",
        body:JSON.stringify(send)
    }).then((response)=>{
        response.json().then((result)=>{
            console.log(result[0]);
            console.log(result[1]);
            if(result[0]!="none"){
                let innerAddition = `<option class="pending-values" value="">Select Prescription</option>`;
                for(let i = 0;i<result[0].length;i++){
                    innerAddition += `<option value="${result[0][i]}">${result[0][i]}</option>`;
                }
                document.querySelector(".pending-select").innerHTML = innerAddition;
            }
            if(result[1]!="none"){
                let innerAddition = `<option class="validated-values" value="">Select Prescription</option>`;
                for(let i = 0;i<result[1].length;i++){
                    innerAddition += `<option value="${result[1][i]}">${result[1][i]}</option>`;
                }
                document.querySelector(".valid-select").innerHTML = innerAddition;
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

function validValue(){
  let value = document.querySelector(".valid-select").value;
  displayValue("valid",value);
}

function pendingValue(){
    let value = document.querySelector(".pending-select").value;
    displayValue("pending",value);
}

function displayValue(path,value){
    if(path == "valid"){
        if(value==""){
            document.getElementById("display-valid").innerHTML = "";
        }else{
            let send = {
                uid:getUID(),
                prescriptionNumber:value,
                path:"validatedPrescriptions"
            }
            fetch("/prescription/display",{
                method:"POST",
                cache:"no-cache",
                body:JSON.stringify(send)
            }).then((response)=>{
                response.json().then((result)=>{
                    let subValues = Object.values(result);
                    let expiration = subValues[5];
                    let med = subValues[7];
                    let refills = subValues[14];
                    let doctor = subValues[2]+" "+subValues[3];
                    let instructions = subValues[6];
                    let message = "";
                    message += `<p><strong>Doctor:</strong> ${doctor}</p>`;
                    message += `<p><strong>Medicine:</strong> ${med}</p>`;
                    message += `<p><strong>Re-fills:</strong> ${refills}</p>`;
                    message += `<p><strong>Expiration:</strong> ${expiration}</p>`;
                    message += `<p><strong>Instructions:</strong> ${instructions}</p>`;
                    document.getElementById("display-valid").innerHTML = message;
                })
            })
        }
    }else{
        if(value==""){
            document.getElementById("display-pending").innerHTML = "";
        }else{
            let send = {
                uid:getUID(),
                prescriptionNumber:value,
                path:"patientPrescriptions"
            }
            fetch("/prescription/display",{
                method:"POST",
                cache:"no-cache",
                body:JSON.stringify(send)
            }).then((response)=>{
                response.json().then((result)=>{
                    let subValues = Object.values(result);
                    let name = subValues[0]+" "+subValues[1];
                    let birth = subValues[2];
                    let message = "";
                    message += `<p><strong>Patient:</strong> ${name}</p>`;
                    message += `<p><strong>Date of Birth:</strong> ${birth}</p>`;
                    document.getElementById("display-pending").innerHTML = message;
                })
            })
        }
    }
}

document.querySelector(".back-button").addEventListener("click",()=>{
    window.history.back();
})