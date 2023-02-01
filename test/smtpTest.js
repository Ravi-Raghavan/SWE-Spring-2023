//Test for SMTP email sending

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'swespring2023@gmail.com',
    pass: 'lotrlepvzmwdnsny'
}
});

var mailOptions = {
    from: 'swespring2023@gmail.com',
    to: `rr1133@scarletmail.rutgers.edu`,
    subject: 'Sending Email using Node.js',
    text: `Welcome to the pharmacy. Please confirm your email address`
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
});