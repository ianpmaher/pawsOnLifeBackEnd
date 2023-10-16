const jwt = require('jsonwebtoken');
const Router = require('express').Router;
const urlencoded = require('express').urlencoded;

const jsonencoded = require('express').json;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const corsOpts = {
    origin:["http://localhost:3000","https://pawson.life"],
}


/* TODO: MOVE TO MONGO CLASS LATER */
const db = mongoose.connection;
let users = null;
const schema = new mongoose.Schema({
    username: String,
    email: String,
    password: { type: String, unique: true },
    token: String
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
    // TODO: Add logic to determine if user is authorized
    const token = req.body.userToken || req.query.userToken || req.headers["x-access-token"];

    if (!token) {
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
            console.error(err);
        }
    }
    console.log("Authorization block passed", `Authorization status is: ${req.validated}`);
    return next();
}

router.post("/login", async (req, res) => {
    /* TODO
     -   Check if user exists in database
     -   Validate credentials using encrypted password
                (reference, bcrypt) bcrypt.compare(user_input, stored_password)
     -   Generate new token using user's UID and password
                (refernce, jwt.sign)
     -   On failure, return false or redirect.
     -   On success, return true
    */
    console.log("Login has been hit.");
     const {email, password} = req.body;

     if( !(email && password)){
        console.log("Fail: missing fields");
        return res.status(400).send("Both fields are required");
     }
     const result = await users.findOne({ email:email.toLowerCase()});

     if( result && (await bcrypt.compare(password, result.password))){
        const token = jwt.sign(
            { UID: result._id, email},
            process.env.JWT_KEY,
            {expiresIn: "10m"}
        );

        result.token = token;
        console.log("Login pass.");
        return res.status(200).json(result);
     }
     console.log("Fail: Invalid login.");
     return res.status(400).send("Invalid username/password combination.");
});

router.post("/logout", (req, res) => {
    /* TODO
     -   Invalidate current token stored
     -   Return user to home page
    */
});

router.post("/register", async (req, res) => {
    /* TODO
     -   Check if user exists by username, and email
     -   Validate email address by sending confirmation email
    */
    const {username, email, password} = req.query;
    if(!(username && email && password)) {
        return res.status(400).send("Missing all required input fields.");
    }
     let find = (await users.findOne({ email: req.query.email.toLowerCase() }, { _id: 0 }));
     if(find){ 
        console.log("User exists in database");
        return res.status(409).send("A user exists with that email. Please register with a different email address");
     }else{
        console.log("Email provided is unique. Creating user.");
        const hashedPassword = await bcrypt.hash(req.query.password, 10);
        const result = await users.create({
            username: req.query.username,
            email: req.query.email.toLowerCase(),
            password: hashedPassword,
        });
        console.log(result);
        const token = jwt.sign(
            { UID: result._id, email},
            process.env.JWT_KEY,
            {expiresIn: "10m"}
        );

        result.token = token;

        res.status(200).json(result);
     }
});

router.post("/confirmRegister", (req, res) => {
    /* TODO
     -   Will handle when user validates email address using link sent in email
     -   Create new user in database, prompt for password, and encrypt password
    */
});



module.exports = {
    isAuthorized,
    router
};