const express = require("express")
require("dotenv").config()
const path = require('path')
const session = require("express-session")
const cors = require('cors')
const bcrypt = require('bcrypt')
require('./conn')
const user = require('./models/user.model')


const app = express()
port = process.env.PORT || 3000



app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use(session({
    name: "user_sid",
    secret: 'ed3a7a2101d71527f2df187812f4037ad4cb0ddf6e01ed78d21602175d413b80fd8a089c92cb1ee06c8377d6947eb475537f19893f016671b22fe6ac7728ad23',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, sameSite: true, secure: false, httpOnly: true }
}))


app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'models', 'hotels.json'))
})


app.post("/api/sign-up", async (req, res) => {

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
            req.session.userId = newUser.id;
            res.sendStatus(200)

        }
        catch (err) {
            res.status(400).send(err);
        }

    }

})

app.post("/api/sign-in", async (req, res) => {    

    const loggeduser = await user.findOne({email : req.body.email})
    if (loggeduser) {
        await bcrypt.compare(req.body.password, loggeduser.password, (err, resp) => {
            if (err) {
                return res.sendStatus(400)
            }
            if (resp) {
                req.session.userId = loggeduser.id
                return res.sendStatus(200)
            }
            else {
                return res.sendStatus(401)
            }
        })

    }
    else {
        return res.sendStatus(400)
    }

})



app.listen(port, () => {
    console.log(`server started at port ${port}`)
})
