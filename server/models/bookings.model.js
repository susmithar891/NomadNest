const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    sessionId : {
        type : String,
        required : true
    },
    paymentType : {
        type : String,
        required : true
    },
    paymentIntent : {
        type : String
    },
    userId : {
        type : String,
        ref : 'user',
        requried : true
    },
    hotelId : {
        type : String,
    },
    amountPaid : {
        type : Number,
        required  :true
    }
},{timestamps : true})


const booking = mongoose.model('booking',bookingSchema)

module.exports = booking