const { UserSignIn } = require("../service/index");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const log = require("../config/logger");


const refid = uuidv4();

class SignInController {
  userSignIn = new UserSignIn();

  signInUser = async (req, res) => {
    try {
      log.info(`{signInUser()} started ,refID:${res.userData.refId}`);
      console.log(res.userData);
      const userSignIn = await this.userSignIn.userSignin(req.body, res.userData , res.userData.refId);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: userSignIn.message,
        data: userSignIn.token,
        error: userSignIn.errorList,
      });
    } catch (ex) {
      log.error(`Excption occurred in {signInUser()} refId:${refid} ex:${ex}`);
    }
  };
}

module.exports = SignInController;
