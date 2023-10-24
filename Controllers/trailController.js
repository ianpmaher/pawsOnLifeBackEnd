const mongo = require('./mongo.js'); // mongo.getTrails().find({})
const Router = require('express').Router;
const urlencoded = require('express').urlencoded;
const jsonencoded = require('express').json;
const cors = require('cors');
const corsOpts = {
    origin:process.env.CORSAllowedDomains.split(","),
}
const router = Router();
router.use(urlencoded({extended:true}));
router.use(jsonencoded());
router.use(cors(corsOpts));

router.get("/trails", (req,res) => {
    res.send("ok")
})

module.exports = router;