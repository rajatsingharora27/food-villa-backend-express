const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      enum : ['user','admin'],
      default: 'user'
    }
  },
  {
    collection: "registerUser",
    timestamps: true,
  }
);

module.exports = mongoose.model("registerUser", userSchema);
