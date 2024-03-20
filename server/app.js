const express = require("express")
require("dotenv").config()
const path = require('path')
const session = require("express-session")
const cors = require('cors')
const bcrypt = require('bcrypt')
require('./conn')
const user = require('./models/user.model')

port = process.env.PORT || 4000
const app = express()




app.use(express.json())
app.use(express.urlencoded({extended:false}))




app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'models', 'hotels.json'))
})


app.post("/api/sign-up/", async (req, res) => {

    const checkaval_email = await user.findOne({ email: req.body.email });

    if (checkaval_email) {
        res.status(409).json("Email already exists");
    }
    else {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);

            const newUser = await new user({ firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, password: hashedPass });
            await newUser.save();

            res.sendStatus(200)

        }
        catch (err) {
            res.status(400).send(err);
        }

    }

})



app.listen(port, () => {
    console.log(`server started at port ${port}`)
})
