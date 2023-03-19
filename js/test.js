const admin = require("./firebase").admin;
var db = admin.database();
var validatedPrescriptions = db.ref(`/validatedPrescriptions/`);

var uid = "8i721zuuHoR9LOxC5u2ZL99fkNi2"

validatedPrescriptions.child(`${uid}/111-2222-333`).set({
    dateOfBirth: "03/08/2002", 
    doctorEmail: "ravi0308raghavan@gmail.com", 
    doctorFirstName: "WALTER", 
    doctorLastName: "WHITE",
    doctorUID: "sW46q8TFxmXao96NiLSYYzG3u3p2", 
    dosage : "100mg",
    expireDate : "06/19/2023",

    instructions : "Snort",

    issueDate : "03/19/2023",

    medication : "METH",

    patientAccountEmail: "rr1133@scarletmail.rutgers.edu",
    patientFirstName : "RAVI",

    patientLastName : "RAGHAVAN",
    patientUID: `${uid}`,
    prescriptionNumber : "111-2222-333",
    refills : "25"
})

validatedPrescriptions.child(`${uid}/111-2222-334`).set({
    dateOfBirth: "03/08/2002", 
    doctorEmail: "ravi0308raghavan@gmail.com", 
    doctorFirstName: "WALTER", 
    doctorLastName: "WHITE",
    doctorUID: "sW46q8TFxmXao96NiLSYYzG3u3p2", 
    dosage : "100mg",
    expireDate : "06/19/2023",

    instructions : "Snort",

    issueDate : "03/19/2023",

    medication : "METH",

    patientAccountEmail: "rr1133@scarletmail.rutgers.edu",
    patientFirstName : "RAVI",

    patientLastName : "RAGHAVAN",
    patientUID: `${uid}`,
    prescriptionNumber : "111-2222-333",
    refills : "25"
})