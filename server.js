require('dotenv').config();
const express = require('express');
const router = require('./Controllers/router');
const app = express();

app.use(router)

app.listen(4013, async () => {
    console.log("Initializing mongo")
    await require('./Controllers/mongo').init();
    console.log("Server live at http://localhost:4013");
});