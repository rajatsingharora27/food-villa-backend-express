const log = require("../config/logger");
const userSignupModel = require("../model/userSignModel");
var jwt = require("jsonwebtoken");

class UserSignIn {
  userSignin = async (userData) => {
    try {
      log.info("{userSignin() service started}");
    } catch (ex) {}
  };

 
}

module.exports = UserSignIn;
