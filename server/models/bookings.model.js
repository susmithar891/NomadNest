const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    // refNo : {
    //     type : String,
    //     required : true
    // },
    transactionId : {
        type : String,
        requied : true
    },
    paymentType : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        ref : 'user',
        requried : true
    },
    reservedId : {
        type : "String",
        ref  : "reserve",
        requried : true
    },
    // hotelId : {
    //     type : String,
    //     ref : 'hotel',
    //     required : true,
    // },
    // bookedRoomIds : {
    //     type : Array(String),
    //     ref : 'room',
    //     required : true
    // },
    amountPaid : {
        type : Number,
        required  :true
    }
    // adults : {
    //     type : Number,
    //     required : true
    // },
    // children : {
    //     type : Number,
    //     required : true
    // },
    // inDate : {
    //     type : Date,
    //     requried : true
    // },
    // outDate : {
    //     type : Date,
    //     requried : true
    // }
})


const booking = mongoose.model('booking',bookingSchema)

module.exports = booking