const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        // required : true
    },
    profilePic :{
        type : String,
    },
    email :{
        type : String,
        required : true
    },
    password : {
        type : String,        
    }
},{timestamps : true});

const user = mongoose.model('user',userSchema);

module.exports = user;