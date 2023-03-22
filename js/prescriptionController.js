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

async function getPatientPrescriptionsProcess(req,res){
    try{
        const patientPrescriptionList = await patientPrescription.getPatientPrescriptions();
        const data = {
            patientPrescriptionList
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function deletePatientPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {patientUID, prescriptionNumber} = JSON.parse(body);
        const deletePatientREF = await patientPrescription.deletePatientPrescription(patientUID,prescriptionNumber);
        const data = {
            deletePatientREF
        };
        res.writeHead(204,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function deleteDoctorPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {doctorUID,prescriptionNumber} = JSON.parse(body);
        const deleteDoctorREF = await patientPrescription.deleteDoctorPrescription(doctorUID,prescriptionNumber);
        const data = {
            deleteDoctorREF
        };
        res.writeHead(204,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function createPrescriptionBankProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const bankNumberREF = await patientPrescription.createPrescriptionBank(bankNumber);
        const data ={
            bankNumberREF
        };
        res.writeHead(201,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function getPrescriptionBankProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const validPrescriptionNumber = await patientPrescription.getPrescriptionBank(bankNumber);
        
        const data = {
            returnValue : validPrescriptionNumber
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function changeStatusBankNumberPatientProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const message = await patientPrescription.changeStatusBankNumberPatient(bankNumber);
        const data = {
            message:message
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function bankToDoctorPipelineProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const message = await patientPrescription.bankToDoctorPipeline(bankNumber);
        const data = {
            message:message
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function patientPipelineToActiveProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const message = await patientPrescription.patientPipelineToActive(bankNumber);
        const data = {
            message:message
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }   
}

async function doctorPipelineToActiveProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const message = await patientPrescription.doctorPipelineToActive(bankNumber);
        const data = {
            message:message
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function getFromPatientPipelineProcess(req, res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const validPrescriptionNumber = await patientPrescription.getFromPatientPipeline(bankNumber);
        
        const data = {
            returnValue : validPrescriptionNumber
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function getFromDoctorPipelineProcess(req,res){
    try{
        let body = await getPostData(req);
        const bankNumber = JSON.parse(body);
        const validPrescriptionNumber = await patientPrescription.getFromDoctorPipeline(bankNumber);
        
        const data = {
            returnValue : validPrescriptionNumber
        };
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

async function getRandomBankNumberProcess(req,res){
    try{
        const bankNumber = await patientPrescription.getRandomBankNumber();
        const data = {
            number : bankNumber
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
    createValidatedPrescriptionProcess,
    getPatientPrescriptionsProcess,
    deletePatientPrescriptionProcess,
    deleteDoctorPrescriptionProcess,
    createPrescriptionBankProcess,
    getPrescriptionBankProcess,
    changeStatusBankNumberPatientProcess,
    getFromPatientPipelineProcess,
    patientPipelineToActiveProcess,
    bankToDoctorPipelineProcess,
    getFromDoctorPipelineProcess,
    doctorPipelineToActiveProcess,
    getRandomBankNumberProcess
};