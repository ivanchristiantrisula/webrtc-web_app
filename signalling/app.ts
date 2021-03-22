import express from "express"
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);;
const io = socket(server,{
    cors: {
      origin: '*',
    }
});


const users = {};

io.on('connection', socket =>{
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

server.listen(3002,()=>{console.log("Signalling server running at port 3002")});