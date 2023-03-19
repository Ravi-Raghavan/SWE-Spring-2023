const patientPrescription = require('./prescriptionModel');
const { getPostData } = require('./utils');

async function createPatientPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {dateOfBirth,firstName,issueDate,lastName,patientEmail,patientUID,prescriptionNumber} = JSON.parse(body);
        const prescriptionREF = await patientPrescription.createPatientPrescription(dateOfBirth,firstName,issueDate,lastName,patientEmail,patientUID,prescriptionNumber);
        const data = {
            id: prescriptionREF
        };
        res.writeHead(201, {'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function createValidatedPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {
            dateOfBirth,doctorAccountEmail,
    doctorFirstName,doctorLastName,doctorUID,dosage,expireDate,instructions,
    issueDate,medication,patientAccountEmail,patientFirstName,patientLastName,
    patientUID,prescriptionNumber,refills
        } = JSON.parse(body);

        const validatedPrescriptionREF = await patientPrescription.createValidatedPrescription(dateOfBirth,doctorAccountEmail,
            doctorFirstName,doctorLastName,doctorUID,dosage,expireDate,instructions,
            issueDate,medication,patientAccountEmail,patientFirstName,patientLastName,
            patientUID,prescriptionNumber,refills);

            const data = {
                id: validatedPrescriptionREF
            };
            res.writeHead(201, {'Content-Type':'application/json'});
            res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function createDoctorPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {dateOfBirth,doctorEmail,doctorFirstName,doctorLastName,doctorUID,dosage,expireDate,instructions,
                issueDate,medication,patientFirstName,patientLastName,prescriptionNumber,refills} = JSON.parse(body);
                const dprescriptionREF = await patientPrescription.createDoctorPrescription(
                    dateOfBirth,doctorEmail,doctorFirstName,doctorLastName,doctorUID,dosage,expireDate,instructions,
                issueDate,medication,patientFirstName,patientLastName,prescriptionNumber,refills
                );

                const dprescriptionId = 7;
                const data = {
                    id:dprescriptionId
                };
                res.writeHead(201, {'Content-Type':'application/json'});
                res.end(JSON.stringify(data));

    }catch (err){
        console.log(err);
    }
}

async function getAccountTypeForPPProcess(req,res){
    try{
        let body = await getPostData(req);
        const uidMessage = JSON.parse(body);
        const gotType = await patientPrescription.getAccountTypeForPP(uidMessage);
        const data = {
            type:gotType
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function getDoctorPrescriptionsProcess(req,res){
    try{
        const doctorPrescriptionsList = await patientPrescription.getDoctorPrescriptions();
        const data = {
            doctorPrescriptionsList
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

module.exports = {
    createPatientPrescriptionProcess,
    createDoctorPrescriptionProcess,
    getAccountTypeForPPProcess,
    getDoctorPrescriptionsProcess,
    createValidatedPrescriptionProcess
};