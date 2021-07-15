import express from "express";
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socket = require("socket.io");

let userModel = require("./models/userModel");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsConfig = {
  credentials: true,
  origin: process.env.FRONTEND_URI,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsConfig));
app.use(cookieParser());

app.use("/api/user/", userRouter);

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB successfully connected!");
});

const server = http.createServer(app);

let users = {};
let filteredUsers = {};
let meetingRooms = {};

const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  let userData = require("./library/decodeToken")(
    socket.handshake.headers.cookie.replace("token=", "")
  );

  if (userData) {
    console.log(userData);
    if (!users[socket.id]) {
      users[socket.id] = userData;
      console.log(userData.email + " connected!");
    }
  }

  socket.emit("yourID", socket.id);

  io.sockets.emit("allUsers", users);

  socket.on("disconnect", () => {
    console.log(userData.email + " disconnected!");
    delete users[socket.id];
    io.sockets.emit("allUsers", users);
  });

  socket.on("transferSDP", (data) => {
    console.log(data);
    io.to(data.to).emit("sdpTransfer", data);
  });

  socket.on("startVideoCall", (data) => {
    io.to(data.to).emit("startVideoCall");
  });
  socket.on("endVideoCall", (data) => {
    io.to(data.to).emit("endVideoCall");
  });

  //MEETING SOCKET

  socket.on("inviteUserToMeeting", (data) => {
    io.to(data.to).emit("meetingInvitation");
  });

  socket.on("respondMeetingInvitation", (data) => {
    io.to(data.to).emit("meetingInvitationResponse", data.response);
  });
});

server.listen(3001, () => {
  console.log("Backend running at port 3001");
});

module.exports = app;
