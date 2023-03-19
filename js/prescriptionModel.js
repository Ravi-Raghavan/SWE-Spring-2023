const FirebaseAPI = require("./FirebaseAPI");

const admin = require("./firebase").admin;
var db = admin.database();


var uref = db.ref(`/users/`);

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

module.exports = {
    createPatientPrescription,
    createDoctorPrescription,
    getAccountTypeForPP
};