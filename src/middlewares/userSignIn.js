const userSignupModel = require("../model/userSignModel");

const verifyUserDetails = async (req, res, next) => {
  try {
    const user = await userSignupModel.findOne({ email: req.body.emailId });
    console.log(user)
    console.log(req.body)
    return user;ł
  } catch (ex) {
    console.log(ex)
  }
};

module.exports = {
  verifyUserSignUpDetailMiddleWare: verifyUserDetails,
};
