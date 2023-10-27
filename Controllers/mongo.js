const mongoose = require('mongoose');

const db = mongoose.connection;
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: { type: String, unique: true },
    token: String,
    verified: Boolean,
    validator: String,
    defaultZip: Number,
})
let users;

const trailSchema = new mongoose.Schema(
    {
        dogsAllowed: Boolean,
        catsAllowed: Boolean,
        rating: Number,
        accessibility: Number,
        difficulty: String, // dropdown option limit it to easy, moderate, hard
        length: Number,
        restrooms: Number,
        waterFountains: Number,
        lastUpdated: Date,
        placesID: String,
        userID: String
    },
    { timestamps: true }
);

let trails;

const petSchema = new mongoose.Schema({
    name: String,
    type: String,
    breed: String,
    age: Number,
    weight: Number,
    owner: String
});

let pets;

async function init() {
    // TODO: Move validation MongoURI set to config handler
    if (!process.env.MongoURI) {
        throw new Error("You must provide a MongoURI in your environment configuration in order to use this application.\
    \n\nPlease set MongoURI in your environment configuration and restart this application.");
    }
    await mongoose.connect(process.env.MongoURI)
        .then(() => {
            console.log('The connection with mongod is established')
            users = mongoose.model(process.env.AuthDB || 'auth', userSchema);
            trails = mongoose.model(process.env.TrailsDB || 'trails', trailSchema);
            pets = mongoose.model(process.env.PetsDB || 'pets', petSchema);
            console.log(users, trails, pets);
        })

}

function getUsers() {
    return users;
}

function getTrails() {
    return trails;
}

function getPets() {
    return pets;
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

module.exports = {
    init,
    getUsers,
    getTrails,
    getPets,
    dropCollection,
    insertMany
}