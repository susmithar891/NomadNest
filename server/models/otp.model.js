const mongoose = require('mongoose')

const otpscheme = mongoose.Schema({
    email: {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    }

},{expireAfterSeconds : 60})

// otpscheme.index({"email" : 1} , )


const otp = mongoose.model("otp",otpscheme)

module.exports = otp