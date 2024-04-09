const nodemailer = require("nodemailer")
require('dotenv').config()

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});


const sendMail = (to_user,reserveId, roomNums, password,totalPrice,hotelName) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to: to_user,
        subject: `NomadNest : Reserved rooms in hotel ${hotelName}`,
        text: `RoomNo(s) :  ${roomNums} are reserved for your arrival. Total price: ${totalPrice}. Reservation ID: ${reserveId}. Your password is ${password}.` // Plain text body
    };
    transporter.sendMail(mailOptions,function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail

