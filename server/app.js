const express = require("express")
require("dotenv").config()
const session = require("express-session")
const cors = require('cors')
const bcrypt = require('bcrypt')



const app = express()
port = process.env.PORT || 3000




app.listen(port,()=>{
    console.log('server started at port 9000')
})
