const Router = require('express').Router;
const urlencoded = require('express').urlencoded;
const expStatic = require('express').static;
const auth = require('./auth');
// import * as mongo from '../classes/mongo.js';
// import methodOverride from 'method-override';

const router = Router();

router.use(urlencoded({extended: true}));
// router.use(methodOverride("_method"))

router.get("/login", auth.login);
router.get("/logout", auth.logout);

router.get("/", auth.isAuthorized, (req,res) => {
    res.send("Well hello there");
})


module.exports = router;