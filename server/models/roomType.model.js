const mongoose = require('mongoose')

const roomTypeSchema = mongoose.Schema({
    hotelId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'hotel',
        required : true
    },
    capacity : {
        adult : {
            type : Number,
            min : 0,
            required : true
        },
        child : {
            type : Number,
            min : 0,
            required : true
        },
    },
    roomType : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        min : 0,
        required : true
    }
})


const roomType = mongoose.model("roomType",roomTypeSchema)

module.exports = roomType