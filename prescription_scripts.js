const {processPatientPrescription, processDoctorPrescription, getPatientPrescriptionRef}= require("./js/prescriptionModelTest");

// processPatientPrescription(
//     "09/10/2002",
//     "Mayank",
//     "03/30/2023",
//     "Barad",
//     "baradmayank@gmail.com",
//     "UIDEX_48shf",
//     "TEST001"
// );

processPatientPrescription(
    "09/10/2002",
    "Mayank",
    "03/30/2023",
    "Barad",
    "baradmayank@gmail.com",
    "UIDEX_48shf",
    "TEST002"
);

// processDoctorPrescription(
//     "09/10/2002",
//     "fakeemail@fakeprovider.fake",
//     "John",
//     "Doe",
//     "DUIDExample001",
//     "2 bottles",
//     "05/24/2054",
//     "bruh moment",
//     "03/30/2023",
//     "Tobramycin",
//     "Mayank",
//     "Barad", 
//     "TEST002",
//     "None"
// );

getPatientPrescriptionRef("UIDEX_48shf").then((ref) => {
    // console.log(ref);
    ref.once('value', (snapshot) => {
        console.log(snapshot.val());
    })
})

// console.log(ref);
// ref.then()
// ref.on('value', (snapshot) => {
//     console.log(snapshot.val());
// })