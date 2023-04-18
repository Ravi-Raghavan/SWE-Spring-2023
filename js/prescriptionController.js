

const prescriptionModel = require('./prescriptionModel');
const { getPostData } = require('./utils');

async function getTypeProcess(req,res,queryStringParameters){
    try{
        var uid = queryStringParameters.uid;
        var typePromise = await prescriptionModel.getType(uid);
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(typePromise));
    }catch (err){
        console.log(err);
    }
}

async function getDrugsProcess(req,res,queryStringParameters){
    try{
        var drug = queryStringParameters.drug;
        var drugPromise = await prescriptionModel.getDrugs();
        let signal = false;
        for(let i = 0;i<drugPromise.length;i++){
            if(drug.toUpperCase()==drugPromise[i].toUpperCase()){
                signal = true;
            }
        }
        if(signal){
            res.writeHead(200);
            res.end();
        }else{
            res.writeHead(300);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function addPatientPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const{
            firstName,
            lastName,
            patientEmail,
            patientDOB,
            prescriptionNumber,
            uid
        } = JSON.parse(body);
        let returnString = await prescriptionModel.addPatientPrescription(firstName,lastName,patientEmail,patientDOB,prescriptionNumber,uid);
        if(returnString=="added"){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end();
        }else{
            res.writeHead(400,{'Content-Type':'application/json'});
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function addDoctorPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const{
            patientFirstName,
            patientLastName,
            patientDOB,
            doctorFirstName,
            doctorLastName,
            doctorAccountEmail,
            expireDate,
            medication,
            refills,
            prescriptionNumber,
            instructions,
            uid,
            pharmacy
        } = JSON.parse(body);
        let returnString = await prescriptionModel.addDoctorPrescription(patientFirstName,
            patientLastName,
            patientDOB,
            doctorFirstName,
            doctorLastName,
            doctorAccountEmail,
            expireDate,
            medication,
            refills,
            prescriptionNumber,
            instructions,
            uid,pharmacy);
            if(returnString=="added"){
                res.writeHead(200,{'Content-Type':'application/json'});
                res.end();
            }else{
                res.writeHead(400,{'Content-Type':'application/json'});
                res.end();
            }
    }catch (Err){
        console.log(Err);
    }
}

function getRandomNumber(N) {
    return Math.floor(Math.random() * (N + 1));
  }

async function getRandomPrescriptionProcess(req,res){
    try{
        let returnValue = await prescriptionModel.getRandomPrescription();
        let length = returnValue.length;
        let randomNumber = getRandomNumber(length-1);
        let dataToReturn = {
            item:returnValue[randomNumber]
        }
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(dataToReturn));
    }catch(err){
        console.log(err);
    }
}

async function checkPrescriptionProcess(req,res,queryStringParameters){
    try{
        let pN = queryStringParameters.prescriptionNumber;
        let returnValue = await prescriptionModel.checkPrescription();
        let valueHit =false;
        returnValue.map((item)=>{
            if(item==pN){
                valueHit =true;
            }
        })
        if(valueHit==true){
            res.writeHead(200);
            res.end();
        }else{
            res.writeHead(300);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function validateProcess(req,res){
    try{
    let body = await getPostData(req);
    const {prescriptionNumber} = JSON.parse(body);
    let r = await prescriptionModel.validate(prescriptionNumber);
    //console.log(r);
    if(r.length<3){
        res.writeHead(300);
        res.end();
        return;
    }else{
        var plname = r[1].lastName;
        var dplname = r[2].patientLastName;
        var pfname = r[1].firstName;
        var dpfname = r[2].patientFirstName;
        var pDOB = r[1].patientDOB;
        var dpDOB = r[2].patientDOB;
        if(plname==dplname && pDOB==dpDOB && pfname==dpfname){
            var doctorEmail = r[2].doctorAccountEmail;
            var dfName = r[2].doctorFirstName;
            var dlName = r[2].doctorLastName;
            var dUID = r[2].doctorUID;
            var pharmacyUID = r[2].pharmacyUID;
            var expireDate = r[2].expireDate;
            var instructions = r[2].instructions;
            var med = r[2].medication;
            var patientEmail = r[1].patientEmail;
            var plName = r[1].lastName;
            var pDOB = r[1].patientDOB;
            var pfName = r[1].firstName;
            var pUID = r[1].patientUID;
            var prescriptionNumber1 = r[0];
            var refills = r[2].refills;
            var addedOrNot = await prescriptionModel.addValidatedPrescription(doctorEmail,dfName,dlName,dUID,
                expireDate,instructions,
                med,patientEmail,plName,pDOB,pfName,pUID,
                prescriptionNumber1,refills,pharmacyUID);
            if(addedOrNot=="added"){
                let removeStatus = await prescriptionModel.removePrescriptions(dUID,pUID,prescriptionNumber1);
                if(removeStatus=="Done"){
                    res.writeHead(200,'Content-Type:application/json');
                    res.end(JSON.stringify(patientEmail));
                }else{
                    res.writeHead(402);
                    res.end();
                }
            }
        }else{
            let dE = r[2].doctorAccountEmail;
            let pE = r[1].patientEmail;
            let pUID = r[1].patientUID;
            let dUID = r[2].doctorUID;
            var dataToSend = {
                dE:dE,
                pE:pE,
                pUID:pUID,
                dUID:dUID
            }
            res.writeHead(301,'Content-Type:application/json');
            res.end(JSON.stringify(dataToSend));
        }
    }
    }catch (err){
        console.log(err);
    }
    
}

async function changeStatusProcess(req,res){
    try{
        let body = await getPostData(req);
        const {prescriptionNumber} = JSON.parse(body);
        let status = await prescriptionModel.changeStatus(prescriptionNumber);
        if(status=="done"){
            res.writeHead(203);
            res.end();
        }else{
            res.writeHead(407);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function removeDoctorPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {pN,dUID} = JSON.parse(body);
            let returnStatus = await prescriptionModel.removeDoctorPrescription(dUID,pN);
        if(returnStatus=="removed"){
            res.writeHead(205);
            res.end();
        }else{
            res.writeHead(405);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function removePatientPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {pN,pUID} = JSON.parse(body);
        let returnStatus = await prescriptionModel.removePatientPrescription(pUID,pN);
        if(returnStatus=="removed"){
            res.writeHead(205);
            res.end();
        }else{
            res.writeHead(405);
            res.end();
        }
    }catch (err){
        console.log(err);
    }
}

async function getDrugListProcess(req,res){
    try{
        let returnData = await prescriptionModel.getDrugList();
        res.writeHead(200,'Content-Type:application/json');
        res.end(JSON.stringify(returnData));
    }catch (err){
        console.log(err);
    }
}

async function dropDownProcess(req,res,queryStringParameters){
    try{
        let type = queryStringParameters.type;
        let body = await getPostData(req);
        const {uid} = JSON.parse(body);
        let array = await prescriptionModel.dropDown(type,uid);
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(array));
    }catch (err){
        console.log(err);
    }
}

async function displayProcess(req,res){
    try{
        let body = await getPostData(req);
        const {uid,prescriptionNumber,path} = JSON.parse(body);
        let contents = await prescriptionModel.display(uid,prescriptionNumber,path);
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(contents));
    }catch (err){
        console.log(err);
    }
}

async function getPharamacyProcess(req,res){
    try{        
        const data = Object.values(await prescriptionModel.getPharamacy()).map((userInfo) => {
            return {
                uid: userInfo.uid,
                address: userInfo.address,
                displayName: userInfo.displayName
            }
        });

        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function recyclePrescriptionProcess(req,res,queryStringParameters){
    try{
        let values = Object.values(queryStringParameters);
        let returnValue = await prescriptionModel.recyclePrescription(values[0],values[1]);
        if(returnValue=="done"){
            res.writeHead(201);
            res.end();
        }else{
            res.writeHead(400,{'Content-Type':'application/json'});
            res.end(JSON.stringify(returnValue));
        }
    }catch (err){
        console.log(err);
    }
}

module.exports = {
    getTypeProcess,
    addPatientPrescriptionProcess,
    addDoctorPrescriptionProcess,
    checkPrescriptionProcess,
    validateProcess,
    changeStatusProcess,
    removeDoctorPrescriptionProcess,
    removePatientPrescriptionProcess,
    getDrugsProcess,
    getDrugListProcess,
    getRandomPrescriptionProcess,
    dropDownProcess,
    displayProcess,
    getPharamacyProcess,
    recyclePrescriptionProcess
};