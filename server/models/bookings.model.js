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
    hotelID : {
        type : String,
        ref : 'hotel',
        // requried : true
    },
    reservedId : {
        type : "String",
        ref  : "reserve",
        requried : true
    },
    amountPaid : {
        type : Number,
        required  :true
    }
})


const booking = mongoose.model('booking',bookingSchema)

module.exports = booking