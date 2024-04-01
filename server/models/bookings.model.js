const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    password : {
        type : String,
        requried : true
    },
    refNo : {
        type : String,
        required : true
    },
    transactionId : {
        type : String,
        requied : true
    },
    paymentType : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        requried : true
    },
    hotelId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'hotel',
        required : true,
    },
    bookedRoomIds : {
        type : Array(mongoose.Schema.Types.ObjectId),
        ref : 'room',
        required : true
    },
    amountPaid : {
        type : Number,
        required  :true
    },
    adults : {
        type : Number,
        required : true
    },
    children : {
        type : Number,
        required : true
    },
    inDate : {
        type : Date,
        requried : true
    },
    outDate : {
        type : Date,
        requried : true
    }
})


const booking = mongoose.model('booking',bookingSchema)

module.exports = booking