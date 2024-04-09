const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    hotelId : {
        type : String,
        ref : 'hotel',
        required : true
    },
    userId : {
        type : String,
        ref : 'user',
        requried : true
    },
    rating : {
        type : Number,
        required : true
    },
    text : {
        type : String,
        // maxLength : 
        requried : true
    }

},{timestamps : true})

const comment = mongoose.model('comment',commentSchema)

module.exports = comment