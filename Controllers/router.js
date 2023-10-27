const Router = require('express').Router;
const urlencoded = require('express').urlencoded;
const expStatic = require('express').static;
const auth = require('./auth');
const trails = require('./trailController');
const users = require('./userController');
// import * as mongo from '../classes/mongo.js';
// import methodOverride from 'method-override';

const router = Router();

router.use(urlencoded({extended: true}));
auth.init();
router.use(auth.router);
router.use(trails);
router.use(users);

router.get("/", auth.isAuthorized, (req,res) => {
    console.log(`Testing auth in / -- status: ${req.validated}`)
    res.send("Well hello there");
});


module.exports = router;