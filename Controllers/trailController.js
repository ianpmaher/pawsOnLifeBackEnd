const mongo = require("./mongo.js"); // mongo.getTrails().find({})
const Router = require("express").Router;
const urlencoded = require("express").urlencoded;
const jsonencoded = require("express").json;
const cors = require("cors");
const {isAuthorized} = require('./auth.js');
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

router.post("/getTrail", async(req, res) => {
  console.log("Trails hit")
  const result = await mongo.getTrails().find({ placesID:req.body.placesID});
  const data = result.reduce((review, current) => {
    const total = review.reviews + 1;
    review.dogsAllowed += (current.dogsAllowed ? 1 : 0);
    review.catsAllowed += (current.catsAllowed ? 1 : 0);
    review.rating += current.rating;
    review.accessibility += current.accessibility;
    review.difficulty += current.difficulty;
    review.length += current.length;
    review.restrooms += current.restrooms;
    review.waterFountains += current.waterFountains;
    review.reviews = total;
    return review;
  },{
    dogsAllowed: 0,
    catsAllowed: 0,
    rating: 0,
    accessibility: 0,
    difficulty: 0,
    length: 0,
    restrooms: 0,
    waterFountains: 0,
    lastUpdated: 0,
    placesID: String(req.body.placesID),
    reviews: 0,
    image: req.body.image
  });
  
  if( result ){
    const processed = {
      dogsAllowed : ((data.dogsAllowed / data.reviews ) >= 0.5) ? true : false,
    catsAllowed : ((data.catsAllowed / data.reviews ) >= 0.5) ? true : false,
    accessibility : parseFloat((data.accessibility / data.reviews ).toFixed(2)),
    difficulty : parseFloat((data.difficulty / data.reviews ).toFixed(2)),
    length : parseFloat((data.length / data.reviews ).toFixed(2)),
    restrooms : parseFloat((data.restrooms / data.reviews ).toFixed(2)),
    waterFountains : parseFloat((data.waterFountains / data.reviews ).toFixed(2)),
    rating : parseFloat((data.rating / data.reviews ).toFixed(2)),
    reviews : data.reviews,
    image: data.image
    }
    return res.status(200).json(processed);
  }
  return res.status(200).send(data)
});

//create new details about a trail
router.post("/trails", isAuthorized, async (req, res) => {
  try {
    const newTrail = await mongo.getTrails().create({
      dogsAllowed: Boolean(req.body.dogsAllowed),
      catsAllowed: Boolean(req.body.catsAllowed),
      rating: Number(req.body.rating),
      accessibility: Number(req.body.accessibility),
      difficulty: String(req.body.difficulty),
      length: Number(req.body.length),
      restrooms: Number(req.body.restrooms),
      waterFountains: Number(req.body.waterFountains),
      lastUpdated: new Date(req.body.lastUpdated),
      placesID: String(req.body.placesID),
      image:String(req.body.image)
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

router.post("/random", async(req, res) => {
  console.log("Random hit")
  const result = await mongo.getTrails().aggregate({ $sample:{size:5}});
  return res.status(200).send(result)
});

//TODO: delete infomation by username
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
