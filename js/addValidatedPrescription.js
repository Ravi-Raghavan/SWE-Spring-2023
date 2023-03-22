const admin = require("./firebase").admin;
var db = admin.database();

var validatedPrescriptions = db.ref(`/validatedPrescriptions/`);

validatedPrescriptions.child("J3TH9N8BOpWVtIyPF8WrH4uxQXd2/111-2222-333").set({
    dateOfBirth:"03/08/2002",
        doctorEmail: "ravi0308raghavan@gmail.com",
        doctorFirstName: "Ravi",
        doctorLastName: "Raghavan",
        doctorUID: "awfawef",
        dosage: "25mg",
        expireDate: "09/01/29",
        instructions: "Snort it",
        issueDate: "03/20/2023",
        medication: "Oxycontin",
        patientFirstName: "RAVI",
        patientLastName:  "RAGHAVAN",
        prescriptionNumber: "111-2222-333",
        refills: "25"
})