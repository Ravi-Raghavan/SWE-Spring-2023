const {processPatientPrescription, processDoctorPrescription, getPatientPrescriptionRef}= require("./js/prescriptionModelTest");
const {getEmail} = require("./js/FirebaseAPI");

// processPatientPrescription(
//     "09/10/2002",
//     "Mayank",
//     "03/30/2023",
//     "Barad",
//     "baradmayank@gmail.com",
//     "UIDEX_48shf",
//     "TEST001"
// );

// processPatientPrescription(
//     "09/10/2002",
//     "Simon",
//     "03/30/2023",
//     "Grishin",
//     "simon.grishin@gmail.com",
//     "52kStzCOKHSWunO1CW8wJcJiR933",
//     "TEST003"
// ).catch((err) => console.log(err));

processDoctorPrescription(
    "09/10/2002",
    "doctor@drughub.com",
    "First",
    "Last",
    "lYHzGwS1C6fKQ0tzhL6E2wzxb4t2",
    "2 bottles",
    "05/24/2054",
    "bruh moment",
    "03/30/2023",
    "Tobramycin",
    "Simon",
    "Grishin", 
    "TEST003",
    "None"
).catch((err) => console.log(err));

// getPatientPrescriptionRef("UIDEX_48shf").then((ref) => {
//     // console.log(ref);
//     ref.once('value', (snapshot) => {
//         console.log(snapshot.val());
//     })
// })


// getEmail("52kStzCOKHSWunO1CW8wJcJiR933ss").then((email) => {
//     console.log(email);
// }).catch((err) => {
//     console.log(err);
// })

// console.log(ref);
// ref.then()
// ref.on('value', (snapshot) => {
//     console.log(snapshot.val());
// })