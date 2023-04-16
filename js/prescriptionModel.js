const { async } = require("@firebase/util");
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

async function addDoctorPrescription(pf,pl,pdob,df,dl,demail,dexpire,med,refills,pN,i,uid,pharmacy){
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
        refills:refills,
        prescriptionNumber:pN,
        instructions:i,
        doctorUID:uid,
        pharmacyUID:pharmacy
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

async function validate(pN){
    let path1 = db.ref(`/patientPrescriptions/`);
    let path2 = db.ref(`/doctorPrescriptions/`);
    const patientSide = await new Promise((resolve,reject)=>{
        path1.get().then((snapshot)=>{
            resolve(Object.values(snapshot.val()));
        })
    })
    const doctorSide = await new Promise((resolve,reject)=>{
        path2.get().then((snapshot)=>{
            resolve(Object.values(snapshot.val()));
        })
    })
    let myMap = new Map();
    const patientValues = Object.values(patientSide);
    patientValues.map((item) =>{
        const p1 = Object.keys(item);
        const p2 = Object.values(item);
        for(let i = 0;i<p1.length;i++){
            myMap.set(p1[i],p2[i]);
        }
    })
    //console.log(myMap);
    const dataToValidate = [];
    const doctorValues = Object.values(doctorSide);
    doctorValues.map((item)=>{
        const d1 = Object.keys(item);
        const d2 = Object.values(item);
        for(let i = 0;i<d1.length;i++){
            if(myMap.get(d1[i])!=undefined){
                dataToValidate[0] = d1[i];
                dataToValidate[1] = myMap.get(d1[i]);
                dataToValidate[2] = d2[i];
                if(dataToValidate[0]==pN){
                    i = d1.length+1;
                }
            }
        }
    })
    if(dataToValidate.length>0){
        if(dataToValidate[0]!=pN){
            return [];
        }else{
            return dataToValidate;
        }
    }else{
        return dataToValidate;
    }
    
}

async function addValidatedPrescription(doctorEmail,dfName,dlName,dUID,
    expireDate,instructions,
    med,patientEmail,plName,pDOB,pfName,pUID,
    prescriptionNumber,refills,pharmacy){
        path = db.ref(`/validatedPrescriptions/${pUID}/${prescriptionNumber}/`);
        path.set({
            doctorAccountEmail:doctorEmail,
            doctorFirstName:dfName,
            doctorLastName:dlName,
            doctorUID:dUID,
            expireDate:expireDate,
            instructions:instructions,
            medication:med,
            patientAccountEmail:patientEmail,
            patientLastName:plName,
            dateOfBirth:pDOB,
            patientFirstName:pfName,
            patientUID:pUID,
            prescriptionNumber:prescriptionNumber,
            refills:refills,
            pharmacyUID:pharmacy
        });
        return "added";
    }

    async function removePrescriptions(dUID,pUID,pN){
        let path1 = db.ref(`/patientPrescriptions/${pUID}/${pN}/`);
        let path2 = db.ref(`/doctorPrescriptions/${dUID}/${pN}/`);
        path1.remove();
        path2.remove();
        return "Done";
    }

    async function changeStatus(pN){
        let removePath = db.ref(`/prescriptionBank/${pN}/`);
        let addPath = db.ref(`/activePrescriptions/${pN}/`);
        removePath.remove();
        addPath.set({
            status:"active"
        })
        return "done";
    }   

    async function removeDoctorPrescription(uid,pN){
        let path = db.ref(`/doctorPrescriptions/${uid}/${pN}/`);
        path.remove();
        return "removed";
    }

    async function removePatientPrescription(uid,pN){
        let path = db.ref(`/patientPrescriptions/${uid}/${pN}/`);
        path.remove();
        return "removed";
    }

    async function getDrugs(){
        let path = db.ref(`/Drugs/Prescription/`);
        const list = await new Promise((resolve,reject) =>{
            path.get().then((snapshot)=>{
                resolve(Object.keys(snapshot.val()));
            })
        })
        return list;
    }

    async function getDrugList(){
        let path = db.ref(`/Drugs/`);
        const list = await new Promise((resolve,reject)=>{
            path.get().then((snapshot)=>{
                resolve(snapshot.val());
            })
        })
        return list;
    }

    async function getRandomPrescription(){
        let path = db.ref(`/prescriptionBank/`);
        const promise = await new Promise((resolve,reject)=>{
            path.get().then((snapshot)=>{
                resolve(Object.keys(snapshot.val()));
            })
        })
        return promise;
    }

    async function dropDown(type,uid){
        if(type=="patient"){
            let path1 = db.ref(`/patientPrescriptions/${uid}/`);
            let path2 = db.ref(`/validatedPrescriptions/${uid}/`);
            const promise1 = await new Promise((resolve,reject)=>{
                path1.get().then((snapshot)=>{
                    if(snapshot.val()==null){
                        resolve("none");
                    }else{
                        resolve(Object.keys(snapshot.val()));
                    }
                })
            })
            const promise2 = await new Promise((resolve,reject)=>{
                path2.get().then((snapshot)=>{
                    if(snapshot.val()==null){
                        resolve("none");
                    }else{
                        resolve(Object.keys(snapshot.val()))
                    }
                })
            })
            const promiseArray = [promise1,promise2];
            return promiseArray;
        }else if(type == "doctor"){
            let path1 = db.ref(`/doctorPrescriptions/`);
            let path2 = db.ref(`/validatedPrescriptions/`);
            
        }else{
            return;
        }
    }

    async function display(uid,prescriptionNumber,path){
        const route = db.ref(`/${path}/${uid}/${prescriptionNumber}/`);
        const promise = await new Promise((resolve,reject)=>{
            route.get().then((snapshot)=>{
                resolve(snapshot.val());
            })
        })
        return promise;
    }

    async function getPharamacy(){
        const ref = db.ref(`/users/`).orderByChild('accountType').equalTo('Pharmacy');
        const promise = await new Promise((resolve,reject)=>{
            ref.get().then((snapshot)=>{
                resolve(snapshot.val());
            })
        })
        return promise;
    }

module.exports = {
    getType,
    addPatientPrescription,
    addDoctorPrescription,
    checkPrescription,
    validate,
    addValidatedPrescription,
    removePrescriptions,
    changeStatus,
    removeDoctorPrescription,
    removePatientPrescription,
    getDrugs,
    getDrugList,
    getRandomPrescription,
    dropDown,
    display,
    getPharamacy
};