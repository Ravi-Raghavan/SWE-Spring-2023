const FirebaseAPI = require("./FirebaseAPI");

const admin = require("./firebase").admin;
var db = admin.database();

doctorPresdb = db.ref(`/doctorPrescriptions/`);
var uref = db.ref(`/users/`);
patientPresdb =db.ref(`/patientPrescriptions/`);

async function createPatientPrescription(dateOfBirth, firstName, issueDate,lastName,patientEmail, patientUID,prescriptionNumber){
        
    
    var ref = db.ref(`/patientPrescriptions/${patientUID}/${prescriptionNumber}`);
    ref.set({
        dateOfBirth:dateOfBirth,
        firstName: firstName,
        issueDate: issueDate,
        lastName: lastName,
        patientEmail: patientEmail,
        patientUID: patientUID,
        prescriptionNumber: prescriptionNumber
    });
        
}

async function createValidatedPrescription(dateOfBirth,doctorAccountEmail,
    doctorFirstName,doctorLastName,doctorUID,dosage,expireDate,instructions,
    issueDate,medication,patientAccountEmail,patientFirstName,patientLastName,
    patientUID,prescriptionNumber,refills){
        var vref = db.ref(`/validatedPrescriptions/${patientUID}/${prescriptionNumber}`);
        vref.set({
            dateOfBirth:dateOfBirth,
            doctorAccountEmail:doctorAccountEmail,
            doctorFirstName:doctorFirstName,
            doctorLastName:doctorLastName,
            doctorUID:doctorUID,
            dosage:dosage,
            expireDate:expireDate,
            instructions:instructions,
            issueDate:issueDate,
            medication:medication,
            patientAccountEmail:patientAccountEmail,
            patientFirstName:patientFirstName,
            patientLastName:patientLastName,
            patientUID:patientUID,
            prescriptionNumber:prescriptionNumber,
            refills:refills
        });
    }

async function createDoctorPrescription(dateOfBirth,doctorEmail,doctorFirstName,
    doctorLastName,doctorUID,dosage,expireDate,instructions,
    issueDate,medication,patientFirstName,patientLastName, 
    prescriptionNumber,refills){

    var dref = db.ref(`/doctorPrescriptions/${doctorUID}/${prescriptionNumber}`);
    
    dref.set({
        dateOfBirth:dateOfBirth,
        doctorEmail:doctorEmail,
        doctorFirstName:doctorFirstName,
        doctorLastName:doctorLastName,
        doctorUID:doctorUID,
        dosage: dosage,
        expireDate:expireDate,
        instructions: instructions,
        issueDate:issueDate,
        medication:medication,
        patientFirstName:patientFirstName,
        patientLastName: patientLastName,
        prescriptionNumber:prescriptionNumber,
        refills:refills
    });
}

async function getAccountTypeForPP(UID){
    return FirebaseAPI.getAccountType(UID);
}

async function getDoctorPrescriptions(){
    const doctorPrescriptions = await new Promise((resolve,reject) =>{
        doctorPresdb.get().then((snapshot) =>{
            resolve(snapshot.val());
        })
    })
    return doctorPrescriptions;
}

async function getPatientPrescriptions(){
    const patientPrescriptions  = await new Promise((resolve,reject) => {
        patientPresdb.get().then((snapshot) =>{
            resolve(snapshot.val());
        })
    })
    return patientPrescriptions;
}

async function deletePatientPrescription(patientUID, prescriptionNumber){
    var path = db.ref(`/patientPrescriptions/${patientUID}/${prescriptionNumber}/`);
    path.remove();
    return "done";
}

async function deleteDoctorPrescription(doctorUID, prescriptionNumber){
    var path = db.ref(`/doctorPrescriptions/${doctorUID}/${prescriptionNumber}/`);
    path.remove();
    return "done";
}

async function createPrescriptionBank(bankNumber){
    var path = db.ref(`/prescriptionBank/${bankNumber}/`);
    path.set({
        status: "null"
    });
    return "done";
}

async function getPrescriptionBank(bankNumber){
    var path = db.ref(`/prescriptionBank/`);

    const patientPrescriptions  = await new Promise((resolve,reject) => {
        path.get().then((snapshot)=>{
            var bank = snapshot.val();
            let hit = false;
            var bankNumbers = Object.keys(bank);
            for(let i = 0;i<bankNumbers.length;i++){
                if(bankNumber==bankNumbers[i]){
                    hit = true;
                    resolve(true);
                    i = bankNumbers.length;
                }
            }
            if(hit==false){
                resolve(false);
            }
        });
    })
    return patientPrescriptions;
}

async function changeStatusBankNumberPatient(bankNumber){
    var path = db.ref(`/prescriptionBank/${bankNumber}`);
    var newPath = db.ref(`/prescriptionPipeline/Patient/${bankNumber}`);
    path.remove();
    newPath.set({
        status:"waiting"
    });
    return "done";
}

async function bankToDoctorPipeline(bankNumber){
    var path = db.ref(`/prescriptionBank/${bankNumber}`);
    var newPath = db.ref(`/prescriptionPipeline/Doctor/${bankNumber}`);
    path.remove();
    newPath.set({
        status:"waiting"
    });
    return "done";
}

async function patientPipelineToActive(bankNumber){
    var path = db.ref(`/prescriptionPipeline/Patient/${bankNumber}/`);
    var newPath = db.ref(`/prescriptionActive/${bankNumber}/`);
    path.remove();
    newPath.set({
        status:"active"
    });
    return "done";
}

async function doctorPipelineToActive(bankNumber){
    var path = db.ref(`/prescriptionPipeline/Doctor/${bankNumber}/`);
    var newPath = db.ref(`/prescriptionActive/${bankNumber}/`);
    path.remove();
    newPath.set({
        status:"active"
    });
    return "done";
}

async function getFromPatientPipeline(bankNumber){
    var path = db.ref(`/prescriptionPipeline/Patient`);

    const patientPrescriptions  = await new Promise((resolve,reject) => {
        path.get().then((snapshot)=>{
            var bank = snapshot.val();
            if(bank==null){
                resolve(false);
                
            }else{
                let hit = false;
            var bankNumbers = Object.keys(bank);
            for(let i = 0;i<bankNumbers.length;i++){
                if(bankNumber==bankNumbers[i]){
                    hit = true;
                    resolve(true);
                    i = bankNumbers.length;
                }
            }
            if(hit==false){
                resolve(false);
            }
            }
        });
    })
    return patientPrescriptions;
}

async function getFromDoctorPipeline(bankNumber){
    var path = db.ref(`/prescriptionPipeline/Doctor`);

    const patientPrescriptions  = await new Promise((resolve,reject) => {
        path.get().then((snapshot)=>{
            var bank = snapshot.val();
            if(bank==null){
                resolve(false);
                
            }else{
                let hit = false;
            var bankNumbers = Object.keys(bank);
            for(let i = 0;i<bankNumbers.length;i++){
                if(bankNumber==bankNumbers[i]){
                    hit = true;
                    resolve(true);
                    i = bankNumbers.length;
                }
            }
            if(hit==false){
                resolve(false);
            }
            }
        });
    })
    return patientPrescriptions;
}

module.exports = {
    createPatientPrescription,
    createDoctorPrescription,
    getAccountTypeForPP,
    getDoctorPrescriptions,
    createValidatedPrescription,
    getPatientPrescriptions,
    deletePatientPrescription,
    deleteDoctorPrescription,
    createPrescriptionBank,
    getPrescriptionBank,
    changeStatusBankNumberPatient,
    getFromPatientPipeline,
    patientPipelineToActive,
    bankToDoctorPipeline,
    getFromDoctorPipeline,
    doctorPipelineToActive
};