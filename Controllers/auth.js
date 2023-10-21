const jwt = require('jsonwebtoken');
const Router = require('express').Router;
const urlencoded = require('express').urlencoded;
const nodemailer = require('nodemailer');
const jsonencoded = require('express').json;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const corsOpts = {
    origin:process.env.CORSAllowedDomains.split(","),
}
const transporter = nodemailer.createTransport({
    host: process.env.VerificationEmailHost,
    port: process.env.VerificationEmailPort,
    secure: true,
    auth: {
        user: process.env.VerificationEmailUser,
        pass: process.env.VerificationEmailPass
    }
});

/* TODO: MOVE TO MONGO CLASS LATER */
const db = mongoose.connection;
let users = null;
const schema = new mongoose.Schema({
    username: String,
    email: String,
    password: { type: String, unique: true },
    token: String,
    verified: Boolean,
    validator: String
})
async function init(URI) {
    await mongoose.connect(URI)
        .then(() => {
            console.log('The connection with mongod is established')
        })
    users = mongoose.model(process.env.AuthDB || 'auth', schema);
}

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

async function dropCollection(collection) {
    console.log("Dropping collection::: ", collection);
    return await db.dropCollection(collection)
}

async function createCollection(collection) {
    const result = await db.createCollection(collection);
    console.log("Creating new collection::: ", collection);
    return result;
}

async function insertMany(collection, data) {
    return await db.collection(collection).insertMany(data);
}

/* END MOVE */


(async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("You must provide a JWT key in your environment configuration in order to use this application.\
    \n\nPlease set JWT_KEY in your environment configuration and restart this application.");
    } else {
        if (!process.env.MongoURI) {
            throw new Error("You must provide a Mongo URI in your environment configuration in order to use this application.\
            \n\nPlease set MongoURI in your environment configuration and restart this application.");
            
        }
        await init(process.env.MongoURI);
    }
})();

const router = Router();
router.use(urlencoded({extended:true}));
router.use(jsonencoded());

router.use(cors(corsOpts));
function isAuthorized(req, res, next) {
    const token = req.headers["x-access-token"] || null;
    if (!token || token === "" || token === null) {
        req.validated = false;
    } else {
        try {
            const decode = jwt.verify(token, process.env.JWT_KEY);
            req.UID = decode;
            if (req.UID) req.validated = true;
            else req.validated = false;
        }
        catch (err) {
            req.validated = false;
        }
    }
    console.log("Authorization block passed", `Authorization status is: ${req.validated}`);
    return next();
}

router.post("/authorize", isAuthorized, async(req, res) => {
    if(req.validated){
        res.sendStatus(200);
        return true;
    }else{
        res.sendStatus(403);
        return false;
    }
})

router.post("/login", async (req, res) => {
    console.log("Login has been hit.");
     const {email, password} = req.body;

     if( !(email && password)){
        return res.status(400).send("Both fields are required");
     }
     const result = await users.findOne({ email:email.toLowerCase()});

     if( result && result.verified && (await bcrypt.compare(password, result.password))){
        const token = jwt.sign(
            { UID: result._id, email},
            process.env.JWT_KEY,
            {expiresIn: "10m"}
        );

        result.token = token;
        result.save();
        return res.status(200).json({email:result.email, username:result.username, token:result.token});
     }
     console.log("Fail: Invalid login.");
     return res.status(400).send("Invalid username/password combination.");
});

router.post("/logout", async (req, res) => {
   const token = req.headers["x-access-token"] || null;

   if(token) {
        const result = await users.findOne({ email:email.toLowerCase()});

        if(result) {
            result.token = "";

            result.save();
        }
   }
   return res.status(200);
});

router.post("/register", async (req, res) => {
    const {username, email, password} = req.body;

    if(!(username && email && password)) {
        return res.status(400).send("Missing all required input fields.");
    }
     let find = (await users.findOne({ email: email.toLowerCase() }, { _id: 0 }));
     if(find){ 
        console.log("User exists in database");
        return res.status(409).send("A user exists with that email. Please register with a different email address");
     }else{
        console.log("Email provided is unique. Creating user.");
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await users.create({
            username: username,
            email: email.toLowerCase(),
            password: hashedPassword,
            verified: false,
            validator: ""
        });
        console.log("Created new user in database. Awaiting verification.");
        const validator = await bcrypt.hash(result._id.toString(),4);
        result.validator = validator;
        const info = await transporter.sendMail({
            from: `${process.env.VerificationEmailAlias} <${process.env.VerificationEmailUser}>`,
            to: email,
            subject: `New User Verification`,
            text: "Welcome to PawsOn.life!",
            html: `<h1>Welcome!</h1><br />Thank you for registering for PawsOn.life!<br />In order to finalize your registration, please click <a href="${process.env.VerificationURL}/confirmRegister?id=${result._id}&validation=${validator}">Here</a> to verify your email.`
        }).catch((err) => {
            console.error(err)
        })
        result.save();
        res.sendStatus(200);
     }
});

router.get("/confirmRegister", async (req, res) => {
     const result = await users.findOne({ _id:req.query.id});
     console.log(result);
     if( result && (req.query.validation === result.validator) && await bcrypt.compare(result._id.toString(),req.query.validation)){
        result.verified = true;
        result.validator = "";
        result.save();
        console.log("User has been verified.");
        res.sendStatus(200);
     }
});



module.exports = {
    isAuthorized,
    router
};