const mongoose = require('mongoose')

const hotelSchema = mongoose.Schema({
    location:{
        type : String,
        requried : true
    },
    hotelName:{
        type:String,
        required : true 
    },
    mapsLocation : {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
          },
          longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
          }
    },
    minPrice : {
        type : Number,
        required : true,
        min : 0
    },
    maxPrice : {
        type : Number,
        required : true,
        min : 0
    },
    images : {
        type : Array(String),
        required : true
    },
    ratings : {
        "1" : {
            type:Number,
            min : 0,
            default: 0,
        },
        "2" : {
            type:Number,
            min : 0,
            default: 0,
        },
        "3" : {
            type:Number,
            min : 0,
            default: 0,
        },
        "4" : {
            type:Number,
            min : 0,
            default: 0,
        },
        "5" : {
            type:Number,
            min : 0,
            default: 0,
        }
    },
    roomTypes : {
        type : Array(String),
        required : true
    },
    amenities : {
        type : Array(String),
        required : true
    },
    contactInfo : {
        phone : {
            type : Array(
            {
             "countryCode": {type : String},
             "phoneNumber": {type : String}
        })},
        email : {
            type : String,
        },
    }

},{timestamps : true})

const hotel = mongoose.model("hotel",hotelSchema)

module.exports = hotel