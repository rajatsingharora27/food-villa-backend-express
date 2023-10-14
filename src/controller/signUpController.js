const { UsertSignUp } = require("../service/index");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const log = require("../config/logger");

const refid = uuidv4();
class SignUpController {
  userSignUp = new UsertSignUp();

  addNewUser = async (req, res) => {
    try {
      log.info(`{addNewUser()} started ,refID:${refid}`);
      const userSignUp = await this.userSignUp.userSignup(req.body, refid);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: userSignUp.message,
        data: userSignUp.token,
        error: userSignUp.errorList,
      });
    } catch (ex) {
      log.error(`Excption occurred in {addNewUser()} refId:${refid} ex:${ex}`);
    }
  };
}

module.exports = SignUpController;
