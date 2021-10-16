import wixSecretsBackend from 'wix-secrets-backend';
var nodemailer = require('nodemailer');

export async function sendEmail(toEmail, content) {

    let email = await wixSecretsBackend.getSecret("email").then(email => {return email});
    let password = await wixSecretsBackend.getSecret("gmailPassword").then(password => {return password});

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
    });

    var mailOptions = {
    from: email,
    to: toEmail,
    subject: 'CheckIn Reminder',
    html: '<h3>' + content + '</h3> <a href="https://joshbell9181.wixsite.com/checkin/unsubscribe">unsubscribe</a>'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}
