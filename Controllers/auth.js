const jwt = require('jsonwebtoken');

// TODO: create config singleton class
const config = {
    jwt_key : "test123" // TODO: replace with environment key
}

function isAuthorized(req, res, next) {
    // TODO: Add logic to determine if user is authorized
    const token = req.body.userToken || req.query.userToken || req.headers["x-access-token"];

    if(!token){
        req.validated = false;
    }else{
        try{
            const decode = jwt.verify(token, config.jwt_key);
            req.UID = decode;
            if(req.UID) req.validated = true;
            else req.validated = false;
        }
        catch(err){
            req.validated = false;
            console.error(err);
        }
    }
    console.log("Authorization block passed", `Authorization status is: ${req.validated}`);
    return next();
}

function login (req, res){
    /* TODO
     -   Check if user exists in database
     -   Validate credentials using encrypted password
                (reference, bcrypt) bcrypt.compare(user_input, stored_password)
     -   Generate new token using user's UID and password
                (refernce, jwt.sign)
     -   On failure, return false or redirect.
     -   On success, return true
    */
}

function logout (req, res){
    /* TODO
     -   Invalidate current token stored
     -   Return user to home page
    */
}

function register (req, res) {
    /* TODO
     -   Check if user exists by username, and email
     -   Validate email address by sending confirmation email
    */
}

function confirmRegister (req, res) {
    /* TODO
     -   Will handle when user validates email address using link sent in email
     -   Create new user in database, prompt for password, and encrypt password
    */
}

module.exports = {
    isAuthorized,
    login,
    logout,
    register,
    confirmRegister
};