import { arrayify } from "tslint/lib/utils";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  friends: {
    type: Array,
    required: false,
  },
  blocks: {
    type: Array,
    required: false,
  },
  pendings: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
