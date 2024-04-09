const nodemailer = require("nodemailer")
require('.dotenv').config()

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});


const sendMail = (to_user, text) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to: to_user,
        subject: 'Nomad Nest',
        text: text
    };
    transporter.sendMail(mailOptions(to_user, text), function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail

