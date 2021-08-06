import express from "express";
const { MongoClient } = require("mongodb");
let mongoose = require("mongoose");
import dotenv from "dotenv";
let User = require("../models/userModel");
const bcrypt = require("bcrypt");
let decodeToken = require("../library/decodeToken");
import _ from "underscore";

let app = express.Router();
dotenv.config();

app.post("/register", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let confirm = req.body.confirm;
  let name = req.body.name;
  let username = req.body.username;

  if (password === confirm) {
    let newUser = new User({
      name: name,
      password: await bcrypt.hash(password, 10),
      email: email,
      username: username,
    });
    newUser.save(function (err, u) {
      if (err) return res.status(400).send({ errors: [err.message] });
      return res.status(200).send("OK");
    });
  } else {
    res.status(400).send({
      errors: ["Confirm Password doesn't match Password"],
    });
  }
});

app.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email: new RegExp(email, "i") }, function (err, doc) {
    if (err) return res.status(400).send({ errors: err });
    if (doc != null) {
      bcrypt.compare(password, doc.password, (err, result) => {
        if (err) return console.log(err);
        if (result) {
          let userData = {};
          userData["_id"] = doc._id;
          userData["name"] = doc.name;
          userData["email"] = doc.email;
          userData["username"] = doc.username;
          userData["MBTI"] = doc.MBTI;
          let token = require("../library/generateToken")(userData);

          res.cookie("token", token, { httpOnly: false });
          res.status(200).send({
            user: userData,
          });
        } else {
          res.status(401).send({ errors: ["Wrong email or password"] });
        }
      });
    } else {
      res.status(401).send({ errors: ["User not found!"] });
    }
  });
});

app.get("/findUser", async (req, res) => {
  let keyword = req.query.keyword;

  User.findOne(
    { username: new RegExp("^" + keyword + "$", "i") },
    function (err, doc) {
      if (!err) {
        res.status(200).send(new Array(doc));
      } else {
        res.status(401).send(err);
      }
    }
  );
});

app.post("/addFriend", async (req, res) => {
  if (req.cookies) {
    let user = decodeToken(req.cookies.token);
    let target = req.body.user;
    if (user) {
      User.find(
        [
          { _id: target._id },
          {
            $nor: [{ "friends._id": user._id }, { "pendings._id": user._id }],
          },
        ],
        (err, doc) => {
          if (_.isEmpty(doc)) {
            let targetData = {
              _id: target._id,
              name: target.name,
              email: target.email,
              username: target.username,
            };

            let userData = {
              _id: user._id,
              name: user.name,
              email: user.email,
              username: user.username,
            };
            // User.update({ _id: user._id }, { $push: { pendings: userData } });
            // User.update({ _id: target._id }, { $push: { pendings: targetData } });
            User.updateOne(
              { _id: target._id },
              { $addToSet: { pendings: userData } },
              (err, result) => {
                console.log(result);
              }
            );
            res.status(200).send("Success");
          } else {
            res.status(401).send({ errors: "Already in friendlist" });
          }
        }
      );
    } else {
      res.status(401).send({ errors: "Invalide Token" });
    }
  } else {
    res.status(401).send({ errors: "No Cookie :(" });
  }
});

app.get("/getPendingFriends", (req, res) => {
  if (req.cookies) {
    let user = decodeToken(req.cookies.token);
    if (user) {
      User.findOne({ _id: user._id }, "pendings", (err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).send({ errors: err });
        }

        res.status(200).send(docs);
      });
    } else {
      res.status(400).send({ errors: ["Invalid token. Try re-login?"] });
    }
  } else {
    res.status(400).send({ errors: ["No Cookie??? :("] });
  }
});

app.get("/getFriends", (req, res) => {
  if (req.cookies) {
    let user = decodeToken(req.cookies.token);
    if (user) {
      User.findOne({ _id: user._id }, "friends", (err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).send({ errors: err });
        }

        res.status(200).send(docs);
      });
    } else {
      res.status(400).send({ errors: ["Invalid token. Try re-login?"] });
    }
  } else {
    res.status(400).send({ errors: ["No Cookie??? :("] });
  }
});

app.get("/getBlocks", (req, res) => {
  if (req.cookies) {
    let user = decodeToken(req.cookies.token);
    if (user) {
      User.findOne({ _id: user._id }, "blocks", (err, docs) => {
        if (err) {
          console.log(err);
          res.status(500).send({ errors: err });
        }

        res.status(200).send(docs);
      });
    } else {
      res.status(400).send({ errors: ["Invalid token. Try re-login?"] });
    }
  } else {
    res.status(400).send({ errors: ["No Cookie??? :("] });
  }
});

app.post("/acceptFriendRequest", (req, res) => {
  if (req.cookies) {
    let user = decodeToken(req.cookies.token);
    let target = req.body.target;

    if (user) {
      let userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      };

      User.updateOne(
        { _id: user._id },
        { $pull: { pendings: { _id: target._id } } },
        (err, docs) => {
          if (err) res.status(500).send({ errors: [err] });
          return;
        }
      );
      User.updateOne(
        { _id: target._id },
        { $addToSet: { friends: userData } },
        (err, result) => {
          if (err) res.status(500).send({ errors: [err] });
          return;
        }
      );

      User.updateOne(
        { _id: user._id },
        { $addToSet: { friends: target } },
        (err, result) => {
          if (err) res.status(500).send({ errors: [err] });
          return;
        }
      );

      res.status(200).send("Success");
    } else {
      res.status(400).send({ errors: ["Invalid token. Try re-login?"] });
    }
  } else {
    res.status(400).send({ errors: ["No Cookie??? :("] });
  }
});

app.post("/rejectFriendRequest", (req, res) => {
  if (req.cookies) {
    let user = decodeToken(req.cookies.token);
    let target = req.body.target;

    if (user) {
      let userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      };

      User.updateOne(
        { _id: user._id },
        { $pull: { pendings: { _id: target._id } } },
        (err, docs) => {
          if (err) res.status(500).send({ errors: [err] });
          return;
        }
      );

      res.status(200).send("Success");
    } else {
      res.status(400).send({ errors: ["Invalid token. Try re-login?"] });
    }
  } else {
    res.status(400).send({ errors: ["No Cookie??? :("] });
  }
});

app.get("/testCookie", (req, res) => {
  console.log(req.cookies);
  console.log(decodeToken(req.cookies.token));
});

module.exports = app;
