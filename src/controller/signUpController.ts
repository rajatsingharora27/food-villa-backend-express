import UsertSignUp from "../service/UserSignUp";
import StatusCodes  from "http-status-codes";
import {v4 as uuidV4} from 'uuid';
import log from "../config/logger";

const refid = uuidV4();
class SignUpController {
  userSignUp = new UsertSignUp();

  addNewUser = async (req:any, res:any) => {
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

export default SignUpController;
