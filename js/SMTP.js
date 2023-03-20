
const nodemailer = require('nodemailer');


//This function will send an email to swespring2023@gmail.com 
async function sendContactEmail(emailParameters){
    var user_name = emailParameters.user_name;
    var user_email = emailParameters.user_email;

    var email_subject = emailParameters.email_subject;
    var email_content = emailParameters.email_content;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: `swespring2023@gmail.com`,
        pass: 'lotrlepvzmwdnsny'
    }
      });
    
    var mailOptions = {
        from: `swespring2023@gmail.com`,
        to: 'swespring2023@gmail.com',
        subject: `${email_subject}`,
        text: `Question from ${user_name} with email ${user_email}: ${email_content}`
    };

    result = await new Promise((resolve, rejects) => {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("Error: " + error);
                rejects("Unsuccessfuly Communication");
            } else {
                console.log("Email Sent: " + info.response);

                var automatedReplyMailOptions = {
                    from: `swespring2023@gmail.com`,
                    to: `${user_email}`,
                    subject: `Automated Reply`,
                    text: `Thank you for Contacting Us. A Customer Service Representative will reply to your Query within 24 hours!`
                }
        
                transporter.sendMail(automatedReplyMailOptions, function(error, info){
                    if (error) {
                        console.log("Error: " + error);
                        rejects("Unsuccessfuly Communication");
                    } else {
                        console.log("Email Sent: " + info.response);
                        resolve("Successful Communication");
                    }
                });
            }
        });

    })

    console.log("Done with sendValidationEmail()");
}

//This function will send an email to the desired user email with a link to validate that email account
//email: represents email that we are delivering message to
async function sendValidationEmail(email){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'swespring2023@gmail.com',
        pass: 'lotrlepvzmwdnsny'
    }
    });
    
    var mailOptions = {
        from: 'swespring2023@gmail.com',
        to: `${email}`,
        subject: 'Validate Email Address',
        text: `Please Click the following link to complete the validation of your email: http://localhost:8000/html/email-validated.html`
    };

    result = await new Promise((resolve, rejects) => {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                rejects(error);
            } else {
                resolve('Email sent: ' + info.response);
                console.log("Email Sent: " + info.response);
            }
        });
    })

    console.log("Done with sendValidationEmail()");
}

async function sendValidatedPrescriptionNotification(email,doctorFirstName,doctorLastName,prescriptionNumber){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'swespring2023@gmail.com',
        pass: 'lotrlepvzmwdnsny'
    }
    });

    var mailOptions = {
        from: 'swespring2023@gmail.com',
        to: `${email}`,
        subject: 'Validate Email Address',
        text: `Dear Patient,\n\n     Your Doctor, ${doctorFirstName} ${doctorLastName}, has filled your prescription. Prescription ${"'"+prescriptionNumber+"'"} is now validated and ready to use! Thank you for choosing DrubHub and have a nice day :)\n\nBest,\nThe DrugHub Team`
    };

    result = await new Promise((resolve, reject) =>{
        transporter.sendMail(mailOptions,function(error, info){
            if(error){
                reject(error);
            }else{
                resolve('Email sent: '+ info.response);
                console.log("Email sent " + info.response);
            }
        });
    })

    console.log("Done with sending Notification");
}

module.exports = {
    sendContactEmail: sendContactEmail, 
    sendValidationEmail: sendValidationEmail,
    sendValidatedPrescriptionNotification:sendValidatedPrescriptionNotification
}