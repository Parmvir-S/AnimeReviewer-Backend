require("./db/mongoose");
const express = require("express");
const cors = require("cors");
const router = require("./routers/route");

const app = express();

app.use(cors());
app.use(express.json()); //automatically parse incoming json to an object 
app.use(router);

module.exports = app;