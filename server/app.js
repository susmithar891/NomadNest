//packages
const express = require("express")
require("dotenv").config()
const path = require('path')
const session = require("express-session")
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const mongoose = require('mongoose');
const _ = require("lodash")
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const { jwtDecode } = require("jwt-decode");
const { multer, bucket } = require('./controllers/gcpconnect')
const crypto = require('crypto')





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
const otp = require('./models/otp.model')
const forgotPass = require('./models/passotp.model')
const { accessSync } = require("fs")
const { sendMail, sendOTP, sendPass } = require('./controllers/emailService')
const genRandPass = require('./controllers/generatePass')
const { profile } = require("console")



//definitions
const app = express()
port = process.env.PORT || 4000
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;


const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

//middlewares
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use((req, res, next) => {
//     if (req.originalUrl.includes("/webhook")) {
//         next();
//     } else {
//         express.json({ limit: "1mb" })(req, res, next);
//     }
// });
app.use(cookieparser())
app.use(cors(corsOption));


function createToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
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

function generateOTP() {
    return Math.floor(Math.random() * (899999) + 100000);
}

function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var st = '';
    for (let i = 0; i < length; i++) {
        // Generate a random index to select a character from the charset
        const randomIndex = crypto.randomInt(0, charset.length);
        // Append the randomly selected character to the string
        st += charset[randomIndex];
    }

    return st;
}


const redirectHome = async (req, res, next) => {
    if (req.cookies && req.cookies.session_token && verifyUser(req.cookies.session_token)) {
        try {
            let def_user = await user.findOne({ _id: verifyUser(req.cookies.session_token).id }).select('-password')
            return res.status(200).send({ redirect: 'home', user: def_user })
        }
        catch (e) {
            console.log(e)
            return res.status(403).send(e)
        }

    }
    else {
        next()
    }
}


const redirectLogin = (req, res, next) => {
    if (!verifyUser(req.cookies.session_token)) {
        res.status(403).send({ redirect: 'landing' })
    }
    else {
        next()
    }

}



//api-endpoints
app.get('/', async (req, res) => {
    res.status(200).send("hoi")
})

app.post('/api/check', redirectHome, (req, res) => {
    res.status(200).send({ redirect: "/" })
})

app.post("/api/sign-up", redirectHome, async (req, res) => {

    const checkaval_email = await user.findOne({ email: req.body.email });

    if (checkaval_email) {
        return res.status(409).json({ "error": "Email already exists" });
    }
    else {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);

            const newUser = await new user({ firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, password: hashedPass });

            const def_user = { firstname: newUser.firstName, id: newUser._id, email: newUser.email }

            const token = createToken(def_user);
            res.cookie("session_token", token, { domain: process.env.COOKIE_DOMAIN, maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "none", secure: true });

            await newUser.save();
            return res.status(200).send({ "msg": "user registered successfully" });

        }
        catch (err) {
            return res.status(400).send({ "error": err })
        }

    }
})

app.post("/api/sign-in", redirectHome, async (req, res) => {

    const loggeduser = await user.findOne({ email: req.body.email })
    if (loggeduser) {
        await bcrypt.compare(req.body.password, loggeduser.password, (err, resp) => {
            if (err) {
                return res.status(500).send({ "error": e })
            }
            if (resp) {
                const user = { firstname: loggeduser.firstName, id: loggeduser._id, email: loggeduser.email }
                const token = createToken(user);
                // res.cookie("session_token", token, { domain: process.env.COOKIE_DOMAIN, maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "none", secure: true })
                res.cookie("session_token", token, {maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "none", secure: true })

                return res.status(200).send({ "msg": "Logging In" })
            }
            else {
                return res.status(401).send({ "error": "Invalid username / password" })
            }
        })

    }
    else {
        return res.status(401).send({ "error": "Invalid Credentials" })
    }

})

app.post('/api/logout', (req, res) => {
    // if(req.cookies && req.cookies.session_token){
    res.clearCookie('session_token', { path: '/', domain: process.env.COOKIE_DOMAIN, httpOnly: true, sameSite: "none", secure: true });
    // res.clearCookie('session_token')
    // }
    res.end()
})

app.post('/api/google/sign-in', redirectHome, async (req, res) => {
    const credResponse = req.body.credentialResponse.credential;
    const credResponseDecoded = jwtDecode(credResponse)
    if (process.env.GOOGLE_OAUTH_CLIENT_ID_SIGNIN !== req.body.credentialResponse.clientId) {
        return res.status(403).send({ "error": "client Id's doesn't match" })
    }
    if (!credResponseDecoded.email_verified) {
        return res.status(401).send({ 'error': "email Id is not verified" })
    }
    const checkaval_email = await user.findOne({ email: credResponseDecoded.email });
    if (checkaval_email) {
        const def_user = { firstname: checkaval_email.firstname, id: checkaval_email._id, lastName: checkaval_email.lastname, email: checkaval_email.email }
        const token = createToken(def_user);
        res.cookie("session_token", token, { domain: process.env.COOKIE_DOMAIN, maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "none", secure: true });
        return res.status(200).send({ "msg": "Logging In" });
    }
    else {
        try {
            const newUser = await new user({ firstName: credResponseDecoded.given_name, lastName: credResponseDecoded.family_name, email: credResponseDecoded.email, profilePic: credResponseDecoded.picture });
            const def_user = { firstname: newUser.firstName, id: newUser._id, email: newUser.email }
            const token = createToken(def_user);
            await newUser.save();
            res.cookie("session_token", token, { domain: process.env.COOKIE_DOMAIN, maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "none", secure: true });
            return res.status(200).send({ "msg": "Logging In" });
        }
        catch (err) {
            return res.status(400).send({ "error": err })
        }

    }

})






app.post('/api/genOTP', async (req, res) => {
    const user_email = req.body.email;
    const new_otp = generateOTP();
    let checkaval_email;
    try {
        checkaval_email = await user.findOne({ email: user_email })
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }
    if (checkaval_email) {
        return res.status(401).send({ "error": "Email is already registered" })
    }
    let findEntry
    try {
        findEntry = await otp.findOne({ email: user_email });
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }
    if (findEntry) {
        const del_entry = await otp.deleteMany({ email: user_email });
    }
    try {
        await sendOTP(user_email, new_otp)
    }
    catch (e) {
        return res.status(500).send({ "error": "error in sending Email" })
    }
    try {
        const new_entry = await new otp({ email: user_email, otp: new_otp });
        await new_entry.save()
        return res.status(200).send({ "msg": "OTP generated successfully" })
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }



})

app.post('/api/verifyOTP', async (req, res) => {
    const user_otp = req.body.otp;
    const user_email = req.body.email;
    if (!user_otp || !user_email) {
        return res.status(403).send({ "error": "required email and otp" })
    }
    let checkaval_email;
    try {
        checkaval_email = await user.findOne({ email: user_email })
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }
    if (checkaval_email) {
        return res.status(401).send({ "error": "Email is already registered" })
    }
    try {
        const findEntry = await otp.findOne({ otp: user_otp, email: user_email })
        if (findEntry) {
            const delEntry = await otp.deleteMany({ email: user_email })
            return res.status(200).send({ "msg": "valid OTP" })
        }
        else {
            return res.status(403).send({ "error": "Invalid OTP" })
        }
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }
})




app.post('/api/email-change', async (req, res) => {
    const user_otp = req.body.otp;
    const user_email = req.body.email;
    let checkaval_email;
    try {
        checkaval_email = await user.findOne({ email: user_email })
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }
    if (checkaval_email) {
        return res.status(401).send({ "error": "Email is already registered" })
    }
    let findEntry
    try {
        findEntry = await otp.findOne({ otp: user_otp, email: user_email })
    }
    catch (e) {
        return res.status(500).send({ "error": e })
    }
    if (!findEntry) {
        return res.staus(403).send({ "error": "Invalid OTP" })
    }
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    let user_det = null
    if (def_user) {
        user_det = await user.findOne({ _id: def_user.id })
        user_det.email = user_email;
        await user_det.save()
        const delEntry = await otp.deleteMany({ email: user_email })
        return res.sendStatus(200)
    }
    else {
        return res.status(403).send({ "error": "Invalid Token" })
    }
})

app.post('/api/change-fname', async (req, res) => {
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    let user_det = null
    if (def_user) {
        user_det = await user.findOne({ _id: def_user.id })
        user_det.firstName = req.body.fname;
        await user_det.save()
        res.sendStatus(200)
    }
    else {
        res.sendStatus(403)
    }
})

app.post('/api/change-lname', async (req, res) => {
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    let user_det = null
    if (def_user) {
        user_det = await user.findOne({ _id: def_user.id })
        user_det.lastName = req.body.lname;
        await user_det.save()
        res.sendStatus(200)
    }
    else {
        res.sendStatus(403)
    }
})

app.post('/api/change-pass', async (req, res) => {
    if (req.body.newPass !== req.body.newPass2) {
        return res.status(400).send({ "error": "passwords doesn't match" })
    }
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    let user_det = null
    if (def_user) {
        try {
            user_det = await user.findOne({ _id: def_user.id })
        }
        catch (e) {
            return res.status(500).send(e)
        }
        if (!user_det.password) {
            return res.status(400).send({ "error": "incorrect password" })
        }
        await bcrypt.compare(req.body.prevPass, user_det.password, async (err, resp) => {
            if (err) {
                return res.sendStatus(500)
            }
            if (resp) {

                try {

                    const salt = await bcrypt.genSalt();
                    const hashedPass = await bcrypt.hash(req.body.newPass, salt);

                    user_det.password = hashedPass

                    await user_det.save()
                    return res.sendStatus(200)

                } catch (e) {
                    console.log(e)
                    return res.status(500).send(e)
                }

            }
            else {
                return res.status(400).send({ "error": "incorrect password" })
            }
        })
    }
    else {
        return res.sendStatus(403)
    }
})

app.post('/api/forgot-pass', async (req, res) => {
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    let user_det = null
    if (def_user) {
        try {
            user_det = await user.findOne({ _id: def_user.id })
        }
        catch (e) {
            return res.status(500).send(e)
        }
        if (user_det.email !== req.body.email) {
            return res.status(403).send({ "error": "wrong email" })
        }
        const randomPass = genRandPass(8)

        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(randomPass, salt);
            user_det.password = hashedPass;
            await user_det.save()
            await sendPass(req.body.email, randomPass)
            return res.sendStatus(200)
        }
        catch (e) {
            console.log(e)
            res.status(500).send(e)
        }


    }
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
            const hotelsCount = await hotel.countDocuments({ minPrice: { $lt: maxP }, maxPrice: { $gt: minP } })
            pageCount = Math.ceil(hotelsCount / maxLimit);
        }
        catch (e) {
            res.status(500).send(e)
        }

        try {
            pageData = await hotel.find({ minPrice: { $lt: maxP }, maxPrice: { $gt: minP } }).skip(pageStart).limit(maxLimit)
        } catch (e) {
            console.log(e)
            res.status(500).send(err)
        }
    }
    else {
        try {
            const hotelsCount = await hotel.countDocuments({ location: loc, minPrice: { $lt: maxP }, maxPrice: { $gt: minP } })
            pageCount = Math.ceil(hotelsCount / maxLimit);
        }
        catch (e) {
            console.log(e)
            res.status(500).send(e)
        }

        try {
            pageData = await hotel.find({ location: loc, minPrice: { $lt: maxP }, maxPrice: { $gt: minP } }).skip(pageStart).limit(maxLimit)
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

    try {
        comments = await comment.find({ hotelId: req.params.id })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
    const comms = await Promise.all(comments.map(async (element) => {
        try {
            let eachUser = await user.findOne({ _id: element.userId }).select('-password -updatedAt -email -createdAt -__v -_id')
            // element["user"] = eachUser
            // console.log(element)
            const com = { ...element._doc, user: eachUser }
            return com
        }
        catch (e) {
            console.log(e)
        }

    }));

    let roomtypes = []
    try {
        roomtypes = await roomType.find({ hotelId: req.params.id })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

    try {
        let user_det = null
        if (def_user) {
            user_det = await user.findOne({ _id: def_user.id }).select('-password -updatedAt -email -createdAt -__v -_id')
        }
        const qunt = {
            username: user_det,
            data: hotelData,
            comments: comms,
            roomtypes: roomtypes
        }

        res.status(200).send(qunt)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }


})

app.post('/api/data', async (req, res) => {
    try {
        const roomtypes = await roomType.find({ hotelId: req.body.hotelId })
        const data = {}
        for (let i = 0; i < roomtypes.length; i++) {
            let rt = roomtypes[i]
            const fetch_rooms = await room.find({ hotelId: req.body.hotelId, roomType: rt.roomType })
            const aval_rooms = await fetch_rooms.filter((room) => {
                const aval = room.reservedDates.reduce((acc, reservation) => {
                    // if(acc && (dates.in_date <= reservation.in_date || dates.out_date >= reservation.out_date)){
                    //     console.log(reservation.in_date," ",reservation.out_date)
                    // }
                    return acc && (new Date(req.body.outDate) <= reservation.in_date || new Date(req.body.inDate) >= reservation.out_date);
                }, true);
                return aval;
            });

            data[rt.roomType] = aval_rooms
        }
        console.log("done")

        res.send(data)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

app.post('/api/:id/reserve', async (req, res) => {
    let reserved_rooms = []
    let roomNums = []
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    if (!def_user) {
        res.status(401).send("Unauthoriazed")
    }
    let user_det
    try {
        user_det = await user.findOne({ _id: def_user.id })
    } catch (e) {
        return res.status(500).send(e)
    }
    let total_price = 0
    const dates = { in_date: new Date(req.body.inDate), out_date: new Date(req.body.outDate) }
    const curr_hotel = await hotel.findOne({ _id: req.params.id })
    await Promise.all(Object.entries(req.body.reserve).map(async ([key, value]) => {
        const fetch_rooms = await room.find({ hotelId: req.params.id, roomType: key })
        let aval_rooms = await fetch_rooms.filter((room) => {
            const aval = room.reservedDates.reduce((acc, reservation) => {
                return acc && (dates.in_date <= reservation.in_date || dates.out_date >= reservation.out_date);
            }, true);
            return aval;
        });
        if (aval_rooms.length < value) {
            res.send(new Error("error : avaliable rooms mismatch"))
        }
        aval_rooms = shuffleArray(aval_rooms)
        const bookrooms = aval_rooms.slice(0, value)

        const rooms = await Promise.all(bookrooms.map(async (element) => {
            try {
                const updatedRoom = await room.updateOne(
                    { _id: element._id }, // Filter criteria
                    { $push: { reservedDates: dates } },// Update operation
                );
                if (!updatedRoom) {
                    res.status(500).send({ "msg": "error in reserving room" })
                }
                total_price += element.price
                const obj = { "roomID": element._id, "roomNo": element.roomNo, "price": element.price }
                roomNums.push(element.roomNo)
                return obj

            } catch (error) {
                console.error('Error adding reservation:', error);
            }
        }));
        reserved_rooms = [...reserved_rooms, ...rooms]

    }))

    const randomPass = genRandPass(8)
    const reser = await new reserve({ hotelId: req.params.id, hotelName: curr_hotel.hotelName, password: randomPass, reservedRoomIds: reserved_rooms, userId: def_user.id, adults: req.body.totalAdult, children: req.body.totalChild, price: total_price, inDate: dates.in_date.toISOString(), outDate: dates.out_date.toISOString() })
    reser.save()
    await sendMail(user_det.email, reser._id, roomNums, randomPass, total_price, curr_hotel.hotelName);
    res.send({ reserved_rooms, total_price })

})

app.post('/api/user/:id/reservings', async (req, res) => {
    try {
        const resers = await reserve.find({ userId: req.params.id })
        res.send(resers)
    }
    catch (e) {
        res.status(500).send(e)
    }

})




app.post('/api/user/payment', async (req, res) => {
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    if (!def_user) {
        return res.status(401).send("Unauthoriazed")
    }

    let user_det = null
    try {
        if (def_user) {
            user_det = await user.findOne({ _id: def_user.id }).select('-password -updatedAt -email -createdAt -__v -_id')
        }
    }
    catch (e) {
        return res.status(500).send(e)
    }

    let reserving
    try {
        reserving = await reserve.findOne({ _id: req.body.reserveId })

    }
    catch (e) {
        return res.status(500).send(e)
    }

    if (!reserving) {
        return res.status(400).send({ "error": "no resevartion found" })
    }

    let hotelData;
    try {
        hotelData = await hotel.findOne({ _id: reserving.hotelId })
    }
    catch(e){
        return res.status(500).send({ error: e })
    }
    if (!hotelData) {
        return res.status(400).send({ "error": "No such hotel Id" })
    }
    const lineItems = reserving.reservedRoomIds.map((roomId) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: hotelData.hotelName + " " + roomId.roomNo
                },
                unit_amount: roomId.price
            },
            quantity: 1,
        }
    }

    )


    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/failed`
        })
        reserving.sessionId = session.id
        await reserving.save()
        res.status(200).send({ sessionUrl: session.url });

    } catch (e) {
        res.status(500).send({error : e})
    }


})


app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (!event) {
        console.log("no such event")
    }


    // Handle the event
    switch (event.type) {

        case 'charge.expired':
            const chargeExpired = event.data.object;
            // console.log(event.data.object)
            break;
        case 'charge.failed':
            const chargeFailed = event.data.object;
            // console.log(event.data.object)
            break;
        case 'charge.refunded':
            const chargeRefunded = event.data.object;
            // console.log(event.data.object)
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded


            break;
        case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            break;
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            const sessId = checkoutSessionCompleted.id;
            const amount = checkoutSessionCompleted.amount_total;
            const paymentIntent = checkoutSessionCompleted.payment_intent;
            const paymentType = "card";
            let reservation;
            try{
                reservation = await reserve.findOne({sessionId : sessId})
                reservation.isPaid = true;
            }
            catch(e){
                return response.status(500).send(e)
            }
            if(!reservation){
                return response.sendStatus(400)    
            }
            
            try{
                const new_booking = await new booking({sessionId :sessId,paymentType : paymentType,userId :reservation.userId,hotelId : reservation.hotelId,amountPaid : amount,paymentIntent : paymentIntent});
                await new_booking.save()
                await reservation.save()
            }
            catch(e){
                return response.status(500).send(e)
            }
            
            
            

            break;
        case 'charge.succeeded':
            const chargeSucceeded = event.data.object;


            // const new_booking = new booking({transactionId : transId,paymentIntent : paymentIntent,paymentType : paymentType,amountPaid : amount})

            break;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

app.post('/api/reserving/cancel', async (req, res) => {
    const reserveId = req.body.reserveId
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    if (!def_user) {
        res.sendStatus(403)
    }
    let user_det
    try {
        user_det = await user.findOne({ _id: def_user.id })
    } catch (e) {
        res.status(500).send(e)
    }
    if (!user_det) {
        res.sendStatus(403)
    }

    let reservation
    try {
        reservation = await reserve.findOne({ _id: reserveId, userId: user_det._id })
        // console.log(reservation)
    } catch (e) {
        res.status(500).send(e)
    }

    if (!reservation) {
        res.status(400).send({ error: "no such reservation" })
    }

    let bookingInfo;
    try{
        bookingInfo = await booking.findOne({sessionId : reservation.sessionId})
        const refund = await stripe.refunds.create({
            payment_intent: bookingInfo.paymentIntent,
            amount:bookingInfo.amountPaid,
        });
    }catch(e){
        res.status(500).send({error : e})
    }

    if (reservation.inDate <= new Date(Date.now())) {
        res.status(400).send({ error: "you can't cancel this reservation" })
    }

    reservation.reservedRoomIds.forEach(async (reser) => {
        let findRoom
        try {
            findRoom = await room.findOne({ _id: reser.roomID })
            const newresDates = findRoom.reservedDates.filter((dates) => {
                console.log((dates.in_date).toISOString() !== (reservation.inDate).toISOString() || dates.out_date.toISOString() !== reservation.outDate.toISOString())
                return (dates.in_date.toISOString() !== reservation.inDate.toISOString() || dates.out_date.toISOString() !== reservation.outDate.toISOString())
            })
            console.log(newresDates)
            findRoom.reservedDates = newresDates
            console.log(findRoom)
            await findRoom.save()
        }
        catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    })
    
    reservation.isCancelled = true;
    await reservation.save();
    res.sendStatus(200)

})






app.post('/api/user/rate', async (req, res) => {
    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    if (!def_user) {
        res.sendStatus(403)
    }
    const bookingId = req.body.bookingId;
    const password = req.body.password;
    const rating = req.body.rating;
    const text = req.body.comment;
    // try {
    //     const reservation = await reserve.findOne({ _id: bookingId })
    //     if (!reservation) {
    //         res.sendStatus(403)
    //     }
    //     if (reservation.password !== password) {
    //         res.sendStatus(401)
    //     }
    //     const new_comment = await new comment({ hotelId: reservation.hotelId, userId: def_user._id, rating: rating, text: text })
    //     new_comment.save()
    //     res.sendStatus(200)
    // }

    let reservation
    try {
        reservation = await reserve.findOne({ _id: new mongoose.Types.ObjectId(bookingId), password: password, userId: def_user.id })
    }
    catch (e) {
        // console.log(e)
        res.status(500).send(e)
    }
    if (!reservation) {
        return res.sendStatus(403)
    }
    const thatHotel = await hotel.findOne({ _id: reservation.hotelId })
    if (!thatHotel) {
        return res.status(400).send({ "error": "Invalid hotel Id" })
    }
    const new_comment = await new comment({ hotelId: reservation.hotelId, userId: def_user.id, rating: rating, text: text })
    await new_comment.save()
    thatHotel.ratings[rating] += 1
    thatHotel.save()
    res.sendStatus(200)



})

app.get('/api/images', async (req, res) => {
    const [files] = await bucket.getFiles();
    const imageUrls = [files][0].map((ele) => {
        filename = ele.parent.parent.apiEndpoint + '/' + ele.metadata.bucket + '/' + ele.metadata.name
        return filename
    })
    res.send(imageUrls)
})

app.post('/api/User/uploadPic', multer.single('profile'), async (req, res) => {



    let def_user;
    if (req.cookies) {
        def_user = verifyUser(req.cookies.session_token)
    }
    if (!def_user) {
        res.sendStatus(403)
    }
    let user_det
    try {
        user_det = await user.findOne({ _id: def_user.id })
    } catch (e) {
        res.status(500).send(e)
    }
    if (req.file) {
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        const file_extension = req.file.originalname.slice(
            ((req.file.originalname.lastIndexOf('.') - 1) >>> 0) + 2
        );
        if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(req.file.mimetype)) {
            return res.status(400).send({ error: 'Invalid file' });
        }
    }
    else {
        return res.status(400).send({ error: "provide a image file to proceed" })
    }
    const randString = generateRandomString(32)
    const profilepicname = user_det.firstName + "_" + randString
    let blobstream
    try {
        const blob = bucket.file(`users/${profilepicname}`)
        blobstream = await blob.createWriteStream();
    }

    catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
    try {
        blobstream.on('finish', async () => {
            user_det.profilePic = `https://storage.googleapis.com/nomadnest/users/${profilepicname}`
            try {
                await user_det.save()
                res.status(200).send({ profilePic: `https://storage.googleapis.com/nomadnest/users/${profilepicname}` })
            }
            catch (e) {
                res.status(500).send(e)
            }

        })
        blobstream.end(req.file.buffer)
    } catch (e) {
        res.status(500).send(e)
    }


    // try {
    //     if (req.file) {

    //         
    //         
    //         blobstream.on('finish', async () => {
    //             user_det.profilePic = `https://storage.googleapis.com/nomadnest/users/${profilepicname}`
    //             try {
    //                 await user_det.save()
    //                 res.status(200).send({ profilePic: `https://storage.googleapis.com/nomadnest/users/${profilepicname}` })
    //             }
    //             catch (e) {
    //                 res.status(500).send(e)
    //             }

    //         })
    //         blobstream.end(req.file.buffer)
    //     }
    //     else {
    //         res.staus(204).send({ msg: "provide a image file" })
    //     }
    // }
    // catch (e) {
    //     res.status(500).send(e)
    // }
})

app.post('/api/forgotpass/sendotp', async (req, res) => {
    const user_email = req.body.email;
    const new_otp = generateOTP();
    let checkaval_email;
    try {
        checkaval_email = await user.findOne({ email: user_email })
    }
    catch (e) {
        return res.status(500).send(e)
    }
    if (!checkaval_email) {
        return res.status(401).send({ "error": "Email is not registered" })
    }
    let findEntry
    try {
        findEntry = await forgotPass.findOne({ email: user_email });
    }
    catch (e) {
        return res.status(500).send(e)
    }
    if (findEntry) {
        const del_entry = await forgotPass.deleteMany({ email: user_email });
    }
    await sendOTP(user_email, new_otp)
    const new_entry = await new forgotPass({ email: user_email, otp: new_otp });
    await new_entry.save()
    return res.sendStatus(200)
})

app.post('/api/forgotpass/verifyotp', async (req, res) => {
    const user_otp = req.body.otp;
    const user_email = req.body.email;
    const new_pass = req.body.password
    if (!user_otp || !user_email) {
        return res.status(403).send({ "error": "required email and otp" })
    }
    let checkaval_email;
    try {
        checkaval_email = await user.findOne({ email: user_email })
    }
    catch (e) {
        return res.status(500).send(e)
    }
    if (!checkaval_email) {
        return res.status(401).send({ "error": "Email is not registered" })
    }
    try {
        const findEntry = await forgotPass.findOne({ otp: user_otp, email: user_email })
        if (findEntry) {
            if (checkaval_email.password === new_pass) {
                return res.status(400).send({ error: "new password can't be the same as your old password" })
            }
            await bcrypt.compare(new_pass, checkaval_email.password, async (err, resp) => {
                if (err) {
                    return res.sendStatus(400)
                }
                if (resp) {
                    return res.status(400).send({ error: "new password can't be the same as your old password" })
                }
                else {
                    const salt = await bcrypt.genSalt();
                    const hashedPass = await bcrypt.hash(new_pass, salt);
                    checkaval_email.password = hashedPass
                    await checkaval_email.save()
                    const delEntry = await forgotPass.deleteMany({ email: user_email })
                    return res.sendStatus(200)
                }
            })
        }
        else {
            return res.sendStatus(403)
        }
    }
    catch (e) {
        return res.status(500).send(e)
    }
})





app.listen(port, () => {
    console.log(`server started at port ${port}`)
})