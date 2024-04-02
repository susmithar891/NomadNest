const mongoose = require('mongoose')


const roomSchema = mongoose.Schema({
    isAC : {
        type : Boolean,
        requried : true
    },
    roomType : {
        type : String,
        required : true
    },
    hotelId : {
        type : String,
        ref : 'hotel',
        required : true
    },
    preview:{
        type : String,
        required : true
    },
    roomNo : {
        type : Number,
        requried : true
    },
    reservedDates : {
        type : Array({
            in_date: {
                type: Date,
                required: true
            },
            out_date: {
                type: Date,
                required: true
            }
        }),
        default: [],
        set : function(array) {
            return array.sort((a, b) => new Date(a.in_date) - new Date(b.in_date));
        }
    },
    price : {
        type : Number,
        required : true
    }
    
})

const room = mongoose.model('room',roomSchema)

module.exports = room