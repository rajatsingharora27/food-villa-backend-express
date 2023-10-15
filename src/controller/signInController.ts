import UserSignIn  from "../service/UserSignIn";
import StatusCodes  from "http-status-codes";
import {v4 as uuidV4} from 'uuid';
import log from "../config/logger";


const refid = uuidV4();

class SignInController {
  userSignIn = new UserSignIn();

  signInUser = async (req:any, res:any) => {
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

// module.exports = SignInController;
export default SignInController;
