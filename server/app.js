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

const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOption));

app.use(session({
    name: "user_sid",
    secret: 'ed3a7a2101d71527f2df187812f4037ad4cb0ddf6e01ed78d21602175d413b80fd8a089c92cb1ee06c8377d6947eb475537f19893f016671b22fe6ac7728ad23',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, secure: false, httpOnly: true }
}))





app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'models', 'hotels.json'))
})


app.post("/sign-up", async (req, res) => {

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

            req.session.userId = newUser.id

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
