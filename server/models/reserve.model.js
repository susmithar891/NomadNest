const mongoose = require('mongoose')

const reserveSchema = mongoose.Schema({

    hotelId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'hotel',
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
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
        type : Array(mongoose.Schema.Types.ObjectId),
        ref : 'room',
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
    bookingId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'booking',
    }

},{timestamps : true})


const reserve = mongoose.model('reserve',reserveSchema)

module.exports = reserve