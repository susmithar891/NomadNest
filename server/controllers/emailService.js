const nodemailer = require("nodemailer")
require('dotenv').config()

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});


const cancelBook = (to_user,reserveId,totalPrice,hotelName) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to: to_user,
        subject: `NomadNest : Cancellation of Reserved rooms in hotel ${hotelName}`,
        text: `you have cancelled your reseravtion with Reservation ID: ${reserveId}. \n A total of ${totalPrice} is refuneded into your account` // Plain text body
    };
    transporter.sendMail(mailOptions,function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}





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

const sendOTP = (to_user,otp) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to: to_user,
        subject: `NOMADNEST : email verification`,
        text: `your otp is : ${otp} \n otp will be valid only for 2 hours` // Plain text body
    };
    transporter.sendMail(mailOptions,function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendPass = (to_user,pass) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to: to_user,
        subject: `NOMADNEST : forgot password`,
        text: `your password is : ${pass}` // Plain text body
    };
    transporter.sendMail(mailOptions,function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendMail,
    sendOTP,
    sendPass,
    cancelBook
}

