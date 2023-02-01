
const nodemailer = require('nodemailer');

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
        subject: 'Sending Email using Node.js',
        text: `Please Click the following link to complete the validation of your email: http://localhost:8000/validateEmail`
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

module.exports = {
    sendValidationEmail: sendValidationEmail
}