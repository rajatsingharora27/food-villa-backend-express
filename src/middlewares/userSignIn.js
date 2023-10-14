const userSignupModel = require("../model/userSignModel");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const log = require("../config/logger");
const {
  USER_NOT_FOUND_0010_1,
  USER_NOT_FOUND_0010_2,
} = require("../constants/errorMessage");
const refid = uuidv4();

const verifyUserDetails = async (req, res, next) => {
  try {
    const user = await userSignupModel.findOne({ email: req.body.emailId });
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        refid: refid,
        message: {},
        data: {},
        error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
      });
    }else{
        obj={
            refId:refid,
            user:user,
        }
        res.userData=obj
    }
    next();
  } catch (ex) {
    log.error(`Exception occurrecd due to  ,${ex} `);

    return res.status(StatusCodes.NOT_FOUND).json({
      refid: refid,
      message: {},
      data: {},
      error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
    });
  }
};

const test = (req, res, next) => {};

module.exports = {
  verifyUserSignUpDetailMiddleWare: verifyUserDetails,
  testMiddleWare: test,
};
