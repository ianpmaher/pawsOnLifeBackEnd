const mongo = require("./mongo.js"); // mongo.getTrails().find({})
const Router = require("express").Router;
const urlencoded = require("express").urlencoded;
const jsonencoded = require("express").json;
const cors = require("cors");
const { isAuthorized } = require('./auth.js');
const corsOpts = {
    origin: process.env.CORSAllowedDomains.split(","),
};
const router = Router();
router.use(urlencoded({ extended: true }));
router.use(jsonencoded());
router.use(cors(corsOpts));

router.get("/profile", (req, res) => {
    res.send("Hike with your pets. The reduction in your carbon footprint will help fight global warming.");
});

router.post("/pet",  isAuthorized, async (req, res) => {
    console.log("Pets hit")
    try {
        const { name, type, breed, age, weight } = req.body;
        const owner = req.UID.UID;
        const oldPet = await mongo.getPets().find({ owner: owner });
        if (oldPet.length) {
            return res.status(200).json(oldPet);
        } else {
            const newPet = await mongo.getPets().create({
                name: name,
                type: type,
                breed: breed,
                age: parseInt(age),
                weight: parseFloat(weight),
                owner: owner
            });
            return res.status(200).json(newPet);
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
});

//edit a trails information
router.put("/pet", isAuthorized, async (req, res) => {
    console.log("Pets put hit")
    try {
        const { name, type, breed, age, weight } = req.body;
        const owner = req.UID.UID;
        const oldPet = await mongo.getPets().find({ owner: owner });
        if (oldPet[0]) {
                if(name) {
                    oldPet[0].name = name;
                }
                if(type) {
                    oldPet[0].type = type;
                }
                if(breed) {
                    oldPet[0].breed = breed;
                }
                if(age) {
                    oldPet[0].age = parseFloat(age);
                }
                if(weight) {
                    oldPet[0].weight = parseFloat(weight);
                }
                oldPet[0].save();
            return res.status(200).json(oldPet);
        }else{
            throw new Error({error:"No pet in database by owner."})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
});

module.exports = router;