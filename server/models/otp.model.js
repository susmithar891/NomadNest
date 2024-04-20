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
        expires: 60 // TTL index in seconds
    }
})


const otp = mongoose.model("otp",otpscheme)

module.exports = otp