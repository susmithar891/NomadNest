const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    hotelId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'hotel',
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        requried : true
    },
    text : {
        type : String,
        // maxLength : 
        requried : true
    }

},{timestamps : true})

const comment = mongoose.model('comment',commentSchema)

module.exports = comment