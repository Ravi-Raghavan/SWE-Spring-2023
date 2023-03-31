const { getAccountType } = require("./FirebaseAPI");
const FirebaseAPI = require("./FirebaseAPI");

const admin = require("./firebase").admin;
var db = admin.database();

async function getType(uid){
    let path = db.ref(`/users/${uid}/`);
    const type = await new Promise((resolve,reject) => {
        path.get().then((snapshot) =>{
            var accountType = snapshot.val().accountType;
            resolve(accountType);
        })
    })
    return type;
}

async function addPatientPrescription(f,l,e,d,p,uid){
    let path = db.ref(`/patientPrescriptions/${uid}/${p}/`);
    path.set({
        firstName:f,
        lastName:l,
        patientEmail:e,
        patientDOB:d,
        prescriptionNumber:p,
        patientUID:uid
    });
    return "added";
}

async function addDoctorPrescription(pf,pl,pdob,df,dl,demail,dexpire,med,dos,refills,pN,i,uid){
    let path = db.ref(`/doctorPrescriptions/${uid}/${pN}/`);
    path.set({
        patientFirstName:pf,
        patientLastName:pl,
        patientDOB:pdob,
        doctorFirstName:df,
        doctorLastName:dl,
        doctorAccountEmail:demail,
        expireDate:dexpire,
        medication:med,
        dosage:dos,
        refills:refills,
        prescriptionNumber:pN,
        instructions:i,
        doctorUID:uid
    });
    return "added";
}

async function checkPrescription(){
    let path = db.ref(`/prescriptionBank/`);
    const bank = await new Promise((resolve,reject) =>{
        path.get().then((snapshot)=>{
            var keys = Object.keys(snapshot.val());
            resolve(keys);
        })
    })
    return bank;
}

module.exports = {
    getType,
    addPatientPrescription,
    addDoctorPrescription,
    checkPrescription
};