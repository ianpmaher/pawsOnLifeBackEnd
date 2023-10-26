const mongo = require("./mongo.js"); // mongo.getTrails().find({})
const Router = require("express").Router;
const urlencoded = require("express").urlencoded;
const jsonencoded = require("express").json;
const cors = require("cors");
const corsOpts = {
  origin: process.env.CORSAllowedDomains.split(","),
};
const router = Router();
router.use(urlencoded({ extended: true }));
router.use(jsonencoded());
router.use(cors(corsOpts));

router.get("/trails", (req, res) => {
  res.send("1989 - (Taylor's Version)");
});

router.get("/trails/:id", (req, res) => {
  res.send(req.body);
});

//create new details about a trail
router.post("/trails", async (req, res) => {
  try {
    const newTrail = await mongo.getTrails().create({
      dogsAllowed: Boolean(req.body.dogsAllowed),
      hikedThisTrail: Boolean(req.body.hikedThisTrail),
      rating: Number(req.body.rating),
      difficulty: String(req.body.difficulty),
      length: Number(req.body.length),
      restroomsAvailable: Boolean(req.body.restroomsAvailable),
      waterFountain: Boolean(req.body.waterFountain),
      lastUpdated: new Date(req.body.lastUpdated),
      placesID: String(req.body.placesID),
    });
    res.json(newTrail);
  } catch (error) {
    res.status(400).json(error);
  }
});

//edit a trails information
router.put("/trails/:id", async (req, res) => {
  try {
    const editTrail = await mongo
      .getTrails()
      .findOneAndUpdate({ placesID: req.params.id }, req.body, { new: true });
    res.json(editTrail);
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete infomation by username
router.delete("/trails:username", async (req, res) => {});

// create new dog profile
// router.post("/dogwater", async (req, res) => {
//   try {
//     const newDog = await mongo.getUsers().create({
//       name: String(req.body.name),
//       breed: String(req.body.breed), //dropdown option
//       weight: Number(req.body.weight),
//       age: Number(req.body.age),
//       hikedThisTrail: Boolean(req.body.hikedThisTrail),
//     });
//     res.json(newDog);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// edit dog inforamtion
// router.put("/dogwater/:username", async (req, res) => {
//   try {
//     const editDog = await mongo
//       .getUsers()
//       .findOneAndUpdate({ username: req.params.username }, req.body, {
//         new: true,
//       });
//     res.json(editDog);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

module.exports = router;
