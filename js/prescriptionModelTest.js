const {getEmail} = require("./FirebaseAPI");

/* Firebase */
const FirebaseAPI = require("./FirebaseAPI");
const admin = require("./firebase").admin;
const db = admin.database();

/* Currently, these references are just temp references that are not associated with the main prescription references. */
const pPresRef = db.ref('/unverifiedPrescriptions/patientPrescriptions');
const dPresRef = db.ref('/unverifiedPrescriptions/doctorPrescriptions');
const vPresRef = db.ref('/__validatedPrescriptions');

/* Add support for getting a promise to a ref that can extract all unverified patient prescriptions */
async function getPatientPrescriptionRef(patientUID) {
    return pPresRef.orderByChild('patientUID').equalTo(patientUID);
}

/* Same as above, but for doctors */
async function getDoctorPrescriptionRef(doctorUID) {
    return dPresRef.orderByChild('doctorUID').equalTo(doctorUID);
}

// TODO: FINISH
async function verifyPrescription(prescriptionNumber) {
    let patientInfo = {
        firstName: null,
        lastName: null,
        DOB: null,
        issueDate: null
    };
    let doctorInfo = {
        firstName: null,
        lastName: null,
        DOB: null,
        issueDate: null
    };

    let patientInfoFull = null;
    let doctorInfoFull = null;

    await pPresRef.child(prescriptionNumber).once('value', (snapshot) => {
        // console.log(snapshot.val());
        patientInfo.firstName = snapshot.child("firstName").val();
        patientInfo.issueDate = snapshot.child("issueDate").val();
        patientInfo.lastName = snapshot.child("lastName").val();
        patientInfo.DOB = snapshot.child("dateOfBirth").val();

        patientInfoFull = snapshot.val();
    })
    await dPresRef.child(prescriptionNumber).once('value', (snapshot) => {
        // console.log(snapshot.child("doctorFirstName").val());
        doctorInfo.firstName = snapshot.child("patientFirstName").val();
        doctorInfo.issueDate = snapshot.child("issueDate").val();
        doctorInfo.lastName = snapshot.child("patientLastName").val();
        doctorInfo.DOB = snapshot.child("dateOfBirth").val();

        doctorInfoFull = snapshot.val();
    })

    // console.log(JSON.stringify(patientInfo) === JSON.stringify(doctorInfo));
    
    /* If the prescriptions match, then great. Add it to the list of verified prescriptions. */
    if(JSON.stringify(patientInfo) === JSON.stringify(doctorInfo)) {
        const validRef = vPresRef.child(prescriptionNumber);
        validRef.set({
            dateOfBirth: doctorInfoFull.dateOfBirth,
            doctorAccountEmail: doctorInfoFull.doctorEmail,
            doctorFirstName: doctorInfoFull.doctorFirstName,
            doctorLastName: doctorInfoFull.doctorLastName,
            doctorUID: doctorInfoFull.doctorUID,
            dosage: doctorInfoFull.dosage,
            expireDate: doctorInfoFull.expireDate,
            instructions: doctorInfoFull.instructions,
            issueDate: doctorInfoFull.issueDate,
            medication: doctorInfoFull.medication,
            patientAccountEmail: patientInfoFull.patientEmail,
            patientFirstName: patientInfoFull.firstName,
            patientLastName: patientInfoFull.lastName,
            patientUID: patientInfoFull.patientUID,
            prescriptionNumber: prescriptionNumber,
            refills:doctorInfoFull.refills
        });

         /* This code will remove the prescriptions from the list of unused prescriptions */
        pPresRef.child(prescriptionNumber).remove();
        dPresRef.child(prescriptionNumber).remove();
    }

}

/** Adds patient prescription information
 * THROWS an error if..
 *  UID does not exist
 *  email doesn't match
 */
async function processPatientPrescription(dateOfBirth, firstName, issueDate, lastName, patientEmail, patientUID, prescriptionNumber) {
    // const email = await getEmail(patientUID);
    try {
        var email = await getEmail(patientUID);
    } catch(err) {
        throw Error(err);
    }

    if(patientEmail === email) {
        const ref = pPresRef.child(prescriptionNumber);
        ref.set({
            dateOfBirth:dateOfBirth,
            firstName: firstName,
            issueDate: issueDate,
            lastName: lastName,
            patientEmail: patientEmail,
            patientUID: patientUID,
            prescriptionNumber: prescriptionNumber
        }).then(() => {
            verifyPrescription(prescriptionNumber);
        });
    } else {
        throw Error("email doesn't match uid");
    }

}

/** Adds patient prescription information
 * THROWS an error if..
 *  UID does not exist
 *  email doesn't match
 */
async function processDoctorPrescription(dateOfBirth,doctorEmail,doctorFirstName,
    doctorLastName,doctorUID,dosage,expireDate,instructions,
    issueDate,medication,patientFirstName,patientLastName, 
    prescriptionNumber,refills){

    try {
        var email = await getEmail(doctorUID);
    } catch(err) {
        throw Error(err);
    }

    if(email === doctorEmail) {
        const ref = dPresRef.child(prescriptionNumber);
        ref.set({
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
        }).then(() => {
            verifyPrescription(prescriptionNumber);
        })
    } else {
        throw Error("email doesn't match uid");
        // console.log("This is not the email associated with the account.");
    }

    
}

module.exports = {
    processPatientPrescription,
    processDoctorPrescription,
    getPatientPrescriptionRef
}