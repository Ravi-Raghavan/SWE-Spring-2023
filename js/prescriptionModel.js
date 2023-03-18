const FirebaseAPI = require("./FirebaseAPI");

const admin = require("./firebase").admin;
var db = admin.database();
var ref = db.ref(`/patientPrescriptions/`);
var dref = db.ref(`/doctorPrescriptions/`);
var uref = db.ref(`/users/`);

async function createPatientPrescription(dateOfBirth, firstName, issueDate,lastName,patientEmail, patientUID,prescriptionNumber){
    var prescription = {
        dateOfBirth:dateOfBirth,
        firstName: firstName,
        issueDate: issueDate,
        lastName: lastName,
        patientEmail: patientEmail,
        patientUID: patientUID,
        prescriptionNumber: prescriptionNumber
    };
    ref.set({
        [patientUID] : prescription
    });
        
}

async function createDoctorPrescription(dateOfBirth,doctorEmail,doctorFirstName,
    doctorLastName,doctorUID,dosage,expireDate,instructions,
    issueDate,medication,patientFirstName,patientLastName, 
    prescriptionNumber,refills){

    var prescription = {
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
    }

    dref.set({
        [doctorUID] : prescription
    });
}

module.exports = {
    createPatientPrescription,
    createDoctorPrescription,
};