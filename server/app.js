//packages
const express = require("express")
require("dotenv").config()
const path = require('path')
const session = require("express-session")
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const mongoose = require('mongoose')


// exports-imports
require('./conn')
// const hotels = require('./hotels.json')
const user = require('./models/user.model')
const hotel = require('./models/hotel.model')
const roomType = require('./models/roomType.model')
const room = require('./models/room.model')
const comment = require('./models/comment.model')
const booking = require('./models/bookings.model')
const reserve = require('./models/reserve.model')
// const { toNamespacedPath } = require("path/win32")



//definitions
const app = express()
port = process.env.PORT || 4000
const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

//middlewares
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieparser())
app.use(cors(corsOption));
app.use(session({
    name: "user_sid",
    secret: 'ed3a7a2101d71527f2df187812f4037ad4cb0ddf6e01ed78d21602175d413b80fd8a089c92cb1ee06c8377d6947eb475537f19893f016671b22fe6ac7728ad23',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, secure: false, httpOnly: true }
}))


//functions
function createToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

function verifyUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    }
    catch (e) {
        return null;
    }
}

const redirectHome = (req, res, next) => {
    if (req.cookies && req.cookies.session_token && verifyUser(req.cookies.session_token)) {
        // res.redirect('/home')
        // res.send({"msg" : "this is home"})
        res.status(200).send({ redirect: 'home' })
    }
    else {
        next()
    }
}

const redirectLogin = (req, res, next) => {
    if (!verifyUser(req.cookies.session_token)) {
        // res.redirect('/')
        res.status(403).send({ redirect: 'landing' })
        // res.send({"msg" : "this is Login"})
    }
    else {
        next()
    }

}


//api-endpoints
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'models', 'hotels.json'))
})

app.post('/api/check', redirectHome, (req, res) => {
    res.send({ "msg": "No session detected" });
})
app.post("/api/sign-up", redirectHome, async (req, res) => {

    const checkaval_email = await user.findOne({ email: req.body.email });

    if (checkaval_email) {
        res.status(409).json("Email already exists");
    }
    else {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);

            const newUser = await new user({ firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, password: hashedPass });


            const def_user = { firstname: newUser.firstname, id: newUser.id, lastName: newUser.lastname, email: newUser.email }

            const token = createToken(def_user);
            res.cookie("session_token", token, { httpOnly: true });

            await newUser.save();
            res.sendStatus(200);

        }
        catch (err) {
            res.status(400).send(err)
        }

    }
})
app.post("/api/sign-in", redirectHome, async (req, res) => {

    const loggeduser = await user.findOne({ email: req.body.email })
    if (loggeduser) {
        await bcrypt.compare(req.body.password, loggeduser.password, (err, resp) => {
            if (err) {
                return res.sendStatus(400)
            }
            if (resp) {
                const user = { firstname: loggeduser.firstname, id: loggeduser.id, lastName: loggeduser.lastname, email: loggeduser.email }
                const token = createToken(user);
                res.cookie("session_token", token, { httpOnly: true })

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
app.post('/api/logout', redirectLogin, (req, res) => {
    res.clearCookie('session_token');
    res.end()
    // res.status(200).json({"msg" : "user logged out successfully"})
})
app.post('/api/home/OnloadData', async (req, res) => {
    const maxLimit = 4
    const pageStart = ((parseInt(req.query.page) - 1) * maxLimit)
    const pageEnd = req.query.page * maxLimit

    // const pageData = hotels.slice(pageStart,pageEnd)
    let pageCount = 0
    let pageData = []

    try {
        const hotelsCount = await hotel.countDocuments({})
        pageCount = Math.ceil(hotelsCount / maxLimit);
    }
    catch (e) {
        console.log(e)
        res.status(500).send(err)
    }

    try {
        pageData = await hotel.find({}).skip(pageEnd).limit(maxLimit)
        // console.log(hotels)
    } catch (e) {
        console.log(e)
        res.status(500).send(err)
    }


    // const uniqueLocations = [...new Set(hotels.map(hotel => hotel.location))];

    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }


    try {
        let user_det = null
        if (def_user) {
            user_det = await user.findOne({ _id: def_user.id }).select('-password -updatedAt -email -createdAt -__v -_id')
        }
        const qunt = {
            username: user_det,
            pageCount: pageCount,
            data: pageData
        }

        res.status(200).send(qunt)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
        // throw err
    }


})
app.post('/api/home/data', async (req, res) => {
    const loc = req.query.location;
    const minP = parseInt(req.query.minPrice)
    const maxP = parseInt(req.query.maxPrice)
    const maxLimit = 4
    const pageStart = ((parseInt(req.query.page) - 1) * maxLimit)
    console.log(req.query)

    let pageCount = 0
    let pageData = []
    if (loc === "") {
        try {
            const hotelsCount = await hotel.countDocuments({ minPrice: { $lt: maxP }, MaxPrice: { $gt: minP } })
            pageCount = Math.ceil(hotelsCount / maxLimit);
        }
        catch (e) {
            res.status(500).send(e)
        }

        try {
            pageData = await hotel.find({ minPrice: { $lt: maxP }, MaxPrice: { $gt: minP } }).skip(pageStart).limit(maxLimit)
        } catch (e) {
            console.log(e)
            res.status(500).send(err)
        }
    }
    else {
        try {
            const hotelsCount = await hotel.countDocuments({ location: loc, minPrice: { $lt: maxP }, MaxPrice: { $gt: minP } })
            pageCount = Math.ceil(hotelsCount / maxLimit);
        }
        catch (e) {
            console.log(e)
            res.status(500).send(e)
        }

        try {
            pageData = await hotel.find({ location: loc, minPrice: { $lt: maxP }, MaxPrice: { $gt: minP } }).skip(pageStart).limit(maxLimit)
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }

    res.status(200).send({
        data: pageData,
        location: loc,
        pageCount: pageCount,
        min: minP,
        max: maxP
    })

})

app.post('/api/hotel/:id', async (req, res) => {

    let hotelData
    try {
        hotelData = await hotel.findOne({ _id: req.params.id })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }

    let comments = []

    // try{
    //     comments = await comment.find({hotelId : req.params.id})
    // }
    // catch(e){
    //     console.log(e)
    //     res.status(500).send(e)
    // }
    // comments.forEach(async (element) => {
    //     try{
    //         let eachUser = await user.findOne({_id: element.userId }).select('-password -updatedAt -email -createdAt -__v -_id')
    //         element["user"] = eachUser
    //     }
    //     catch(e){
    //         console.log(e)
    //     }

    // });

    let roomtypes = []
    try {
        roomtypes = await roomType.find({ hotelId: req.params.id })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

    // const rooms = await Promise.all(roomtypes.map(async (ele) => {
    //     try {
    //         const rooms = await room.find({ hotelId: req.params.id, roomType: ele.roomType });
    //         return { ...ele, rooms };
    //     } catch (e) {
    //         console.log(e);
    //         return ele; // Return the original element if an error occurs
    //     }
    // }));

    try {
        let user_det = null
        if (def_user) {
            user_det = await user.findOne({ _id: def_user.id }).select('-password -updatedAt -email -createdAt -__v -_id')
        }
        const qunt = {
            username: user_det,
            data: hotelData,
            comments: comments,
            roomtypes: roomtypes
        }

        res.status(200).send(qunt)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }


})


app.post('/api/hotel/data', async (req, res) => {


    console.log("bdhfdvs")
    // try {

    //     const fetch_rooms = await room.find({ hotelId: req.params.id })
    //     const aval_rooms = fetch_rooms.filter((ele) => {
    //         const aval = ele.reservedDates.filter((ele) => {
    //             // return !((req.body.outDate <= ele.in_date) || (req.body.inDate >= ele.out_date))
    //             return ((req.body.outDate > ele.in_date) && (req.body.inDate < ele.out_date))
    //         })
    //         return aval.length === 0
    //     })

    // }
    // catch(e){
    //     console.log(e)
    //     res.status(500).send(e)
    // }

})


app.post('/api/data', async (req, res) => {
    try {
        const roomtypes = await roomType.find({hotelId : req.body.hotelId})
        const data = {}
        for(let i=0;i<roomtypes.length;i++){
            let rt = roomtypes[i]
            const fetch_rooms = await room.find({hotelId : req.body.hotelId,roomType : rt.roomType})
            const aval_rooms = await fetch_rooms.filter((ele) => {
                const aval = ele.reservedDates.filter((ele) => {
                    // return !((req.body.outDate <= ele.in_date) || (req.body.inDate >= ele.out_date))
                    return ((req.body.outDate > ele.in_date) && (req.body.inDate < ele.out_date))
                })
                return aval.length === 0
            })

            data[rt.roomType] = aval_rooms            
        }

        res.send(data)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})



app.listen(port, () => {
    console.log(`server started at port ${port}`)
})