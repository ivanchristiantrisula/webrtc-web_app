import express from "express";
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const http = require('http');
const socket = require("socket.io");

let userModel = require("./models/userModel");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser())

app.use("/api/user/", userRouter);

mongoose.connect(process.env.DATABASE_URI,{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB successfully connected!")
});

const server = http.createServer(app);

let users = {};

const io = socket(server,{
    cors: {
        origin: '*',
    }
});

io.on('connection', socket =>{
    console.log(socket.handshake.headers.cookie);
    
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
        console.log
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
    socket.on('disconnect', () => {
        console.log("dc");
        delete users[socket.id];
        io.sockets.emit("allUsers", users);
    })
})


server.listen(3001,()=>{console.log("Backend running at port 3001")});

module.exports = app;