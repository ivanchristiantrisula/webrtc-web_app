const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
});

userSchema.plugin(uniqueValidator, {
  message: "This email has already been registered",
});

module.exports = mongoose.model("User", userSchema);
