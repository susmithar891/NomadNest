const mongoose = require('mongoose')

const otpscheme = mongoose.Schema({
    email: {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2*60*60 // TTL index in seconds
    }
})


const forgotpass = mongoose.model("forgotpass",otpscheme)

module.exports = forgotpass