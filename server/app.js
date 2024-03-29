const express = require("express")
require("dotenv").config()
const path = require('path')
const session = require("express-session")
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')

require('./conn')
const user = require('./models/user.model')
const hotels = require('./hotels.json')


const app = express()
port = process.env.PORT || 4000



app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieparser())

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


function createToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
}

function verifyUser(token){
    if(!token) return null;
    try{
        return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    }
    catch(e){
        return null;
    }
}


const redirectHome = (req, res, next) => {
    if (req.cookies.session_token && verifyUser(req.cookies.session_token)) {
        // res.redirect('/home')
        // res.send({"msg" : "this is home"})
        res.status(307).send({redirect : 'home'})
    }
    else {
        next()
    }
}

const redirectLogin = (req, res, next) => {
    if (!verifyUser(req.cookies.session_token)) {
        // res.redirect('/')
        res.status(307).send({redirect : 'landing'})
        // res.send({"msg" : "this is Login"})
    }
    else {
        next()
    }

}

app.get('/',(req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'models', 'hotels.json'))
})


app.post('/OnloadData',redirectLogin, async (req, res) => {
    
    
    const uniqueLocations = [...new Set(hotels.map(hotel => hotel.location))];


    try {
        const user_det = await user.findOne({ id: req.session.userId }).select('-password -updatedAt -email -createdAt -__v -_id')
        const qunt = {
            username: user_det,
            locations: uniqueLocations,
            data: hotels
        }

        res.status(200).send(qunt)
    }
    catch (err) {
        res.status(400).send(err)
        // throw err
    }


})

app.post('/check',redirectHome,(req,res) => {

})


app.post('/data',redirectLogin, async (req, res) => {
    const loc = req.query.location;

    var data = hotels.filter((ele) => {
        return ele.location === loc
    })


    res.status(200).send(data)

})


app.post("/queries",(req,res) => [
    console.log(req.body)
])


app.post("/sign-up",redirectHome, async (req, res) => {

    const checkaval_email = await user.findOne({ email: req.body.email });

    if (checkaval_email) {
        res.status(409).json("Email already exists");
    }
    else {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);

            const newUser = await new user({ firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, password: hashedPass });
            

            const def_user = {firstname : newUser.firstname , id : newUser.id, lastName : newUser.lastname , email : newUser.email}
            
            const token = createToken(def_user);
            res.cookie("session_token",token,{httpOnly : true});
            
            await newUser.save();
            res.sendStatus(200);

        }
        catch (err) {
            res.status(400).send(err)
        }

    }
})

app.post("/sign-in",redirectHome, async (req, res) => {

    const loggeduser = await user.findOne({ email: req.body.email })
    if (loggeduser) {
        await bcrypt.compare(req.body.password, loggeduser.password, (err, resp) => {
            if (err) {
                return res.sendStatus(400)
            }
            if (resp) {
                const user = {firstname : loggeduser.firstname , id : loggeduser.id, lastName : loggeduser.lastname , email : loggeduser.email}
                const token = createToken(user);
                res.cookie("session_token",token,{httpOnly : true})

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
