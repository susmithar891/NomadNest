const mongoose = require('mongoose')

const reserveSchema = mongoose.Schema({
    password : {
        type : String,
        requried : true,
        default : "password"
    },
    hotelId : {
        type : String,
        ref : 'hotel',
        required : true
    },
    isCancelled : {
        type : Boolean,
        default : false
    },
    userId : {
        type : String,
        ref : 'user',
        required : true
    },
    adults : {
        type : Number,
        min : 0,
        required : true
    },
    children : {
        type : Number,
        min : 0,
        required : true
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false
    },
    verifiedBy : {
        type : String,
    },
    verificationId : {
        type : String,
    },
    reservedRoomIds : {
        type : Array(),
        required : true
    },
    inDate : {
        type : Date,
        requried : true
    },
    outDate : {
        type : Date,
        requried : true
    },
    price : {
        type : Number,
        required  :true
    },
    isPaid : {
        type : Boolean,
        deafult : false
    },
    sessionId : {
        type: String,
    },
    hotelName : {
        type : String,
        required : true
    }

},{timestamps : true})


const reserve = mongoose.model('reserve',reserveSchema)

module.exports = reserve