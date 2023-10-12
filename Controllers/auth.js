function isAuthorized(req, res, next) {
    // TODO: Add logic to determine if user is authorized
    console.log("Authorization block passed");
    return next();
}

function login (req, res){

}

function logout (req, res){

}

module.exports = {
    isAuthorized,
    login,
    logout
};