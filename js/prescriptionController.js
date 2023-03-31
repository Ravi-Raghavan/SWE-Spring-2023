

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
            dosage,
            refills,
            prescriptionNumber,
            instructions,
            uid
        } = JSON.parse(body);
        let returnString = await prescriptionModel.addDoctorPrescription(patientFirstName,
            patientLastName,
            patientDOB,
            doctorFirstName,
            doctorLastName,
            doctorAccountEmail,
            expireDate,
            medication,
            dosage,
            refills,
            prescriptionNumber,
            instructions,
            uid);
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

module.exports = {
    getTypeProcess,
    addPatientPrescriptionProcess,
    addDoctorPrescriptionProcess,
    checkPrescriptionProcess
};