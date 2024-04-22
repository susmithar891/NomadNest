const mongoose = require('mongoose')

const roomTypeSchema = mongoose.Schema({
    hotelId : {
        type : String,
        ref : 'hotel',
        required : true
    },
    // hotelName:{
    //     type:String,
    //     required : true 
    // },
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
    },
    avaliableRooms : {
        type:Number,
        min:0,
        requried : true
    },
    reservedRooms:{
        type : Number,
        min : 0,
        required : true
    }
})


const roomType = mongoose.model("roomType",roomTypeSchema)

module.exports = roomType