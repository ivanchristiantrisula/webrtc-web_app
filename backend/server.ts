import express from "express";
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const cors = require("cors");
const cookieParser = require('cookie-parser');

let userModel = require("./models/userModel");

const server = express();
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors({credentials: true, origin: 'http://localhost:3000'}));
server.use(cookieParser())

server.use("/api/user/", userRouter);

mongoose.connect(process.env.DATABASE_URI,{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB successfully connected!")
});


server.listen(3001,()=>{console.log("Backend running at port 3001")});

module.exports = server;