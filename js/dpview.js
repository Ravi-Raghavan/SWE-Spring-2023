function getUID(){
    if(localStorage.getItem("User Record")==null){
      alert("Please create an account / log in, to add a prescription. Thank You!");
    }else{
      var user_record = JSON.parse(localStorage.getItem("User Record"));
      var uid = user_record.uid;
      return uid;
    }
  }

window.onload = function(){
    fetch(`/prescription/dropdown/doctor?uid=${getUID()}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            if(result!=null){
                let prescriptions = Object.values(result);
                //console.log(prescriptions);
                const names = [];
                prescriptions.map((item)=>{
                    let sup = Object.values(item);
                    let name = sup[9]+", "+sup[8]+":"+sup[11];
                    names.push(name);
                })
                names.sort();
                //console.log(names);
                let message = `<option class="pending-values" value="">Select Prescription</option>`;
                names.map((name)=>{
                    let subItems = name.split(":");
                    message += `<option value="${subItems[1]}">${subItems[0]} : ${subItems[1]}</option>`;
                })
                document.querySelector(".pending-select").innerHTML = message;
            }
        })
    })

    fetch(`/prescription/dropdown/doctor/valid?uid=${getUID()}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            if(result!=null){
                let prescriptions = [];
                let array = Object.values(result);
                array.forEach((user)=>{
                    let values = Object.values(user);
                    values.map((item)=>{
                        prescriptions.push(item);
                    })
                })
                let thisDoctors = [];
                prescriptions.map((prescription)=>{
                    if(prescription.doctorUID == getUID()){
                        thisDoctors.push(prescription.patientUID+":"+prescription.prescriptionNumber+":"+prescription.patientLastName+", "+prescription.patientFirstName);
                    }
                })
                console.log(thisDoctors);
                if(thisDoctors.length!=0){
                    let message = `<option class="validated-values" value="">Select Prescription</option>`;
                    thisDoctors.map((item)=>{
                        let data = item.split(":");
                        message+=`<option value="${data[0]}:${data[1]}">${data[2]} : ${data[1]}</option>`;
                    })
                    document.querySelector(".valid-select").innerHTML = message;
                }
            }
        })
    })

}

function pendingValue(){
    let pN = document.querySelector(".pending-select").value;
    if(pN==""){
        document.getElementById("display-pending").innerHTML = "";
        return;
    }
    fetch(`/prescription/display/doctor/pending?uid=${getUID()}&pN=${pN}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            let patient = result.patientFirstName+" "+result.patientLastName;
            let patientDOB = result.patientDOB;
            let medication = result.medication;
            let refills = result.refills;
            let expiration = result.expireDate;
            let instructions = result.instructions;
            let message = "";
            message += `<p><strong>Patient:</strong> ${patient}</p>`;
            message += `<p><strong>Date of Birth:</strong> ${patientDOB}</p>`;
            message += `<p><strong>Medication:</strong> ${medication}</p>`;
            message += `<p><strong>Re-fills:</strong> ${refills}</p>`;
            message += `<p><strong>Expiration Date:</strong> ${expiration}</p>`;
            message += `<p><strong>Instructions:</strong> ${instructions}</p>`;
            document.getElementById("display-pending").innerHTML = message;
        })
    })
}

function validValue(){
    let combined = document.querySelector(".valid-select").value;
    if(combined==""){
        document.getElementById("display-valid").innerHTML = "";
        return;
    }
    const combinedSplit = combined.split(":");
    fetch(`/prescription/display/doctor/valid?uid=${combinedSplit[0]}&pN=${combinedSplit[1]}`,{
        method:"GET",
        cache:"no-cache"
    }).then((response)=>{
        response.json().then((result)=>{
            let patient = result.patientFirstName+" "+result.patientLastName;
            let patientDOB = result.dateOfBirth;
            let medication = result.medication;
            let refills = result.refills;
            let expiration = result.expireDate;
            let instructions = result.instructions;
            let message = "";
            message += `<p><strong>Patient:</strong> ${patient}</p>`;
            message += `<p><strong>Date of Birth:</strong> ${patientDOB}</p>`;
            message += `<p><strong>Medication:</strong> ${medication}</p>`;
            message += `<p><strong>Re-fills:</strong> ${refills}</p>`;
            message += `<p><strong>Expiration Date:</strong> ${expiration}</p>`;
            message += `<p><strong>Instructions:</strong> ${instructions}</p>`;
            document.getElementById("display-valid").innerHTML = message;
        })
    })
}