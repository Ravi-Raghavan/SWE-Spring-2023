const patientPrescription = require('./prescriptionModel');
const { getPostData } = require('./utils');

async function createPatientPrescriptionProcess(req,res){
    try{
        let body = await getPostData(req);
        const {dateOfBirth,firstName,issueDate,lastName,patientEmail,patientUID,prescriptionNumber} = JSON.parse(body);
        const prescriptionREF = await patientPrescription.createPatientPrescription(dateOfBirth,firstName,issueDate,lastName,patientEmail,patientUID,prescriptionNumber);
        const prescriptionId = 6;
        const data = {
            id: prescriptionREF
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
                    id: dprescriptionId
                };
                res.writeHead(201, {'Content-Type':'application/json'});
                res.end(JSON.stringify(data));

    }catch (err){
        console.log(err);
    }
}

module.exports = {
    createPatientPrescriptionProcess,
    createDoctorPrescriptionProcess
};