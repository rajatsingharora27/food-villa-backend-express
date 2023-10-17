import UserSignIn  from "../service/UserSignIn";
import StatusCodes  from "http-status-codes";
import {v4 as uuidV4} from 'uuid';
import log from "../config/logger";
import { Request,Response } from "express";
import {  UserData } from "../Types/SigninMiddlewareResponseSentType";


const refid = uuidV4();

class SignInController {
  userSignIn = new UserSignIn();

  signInUser = async (req:Request, res: Response | any) => {
    try {
      const data:UserData=res.userData;
      console.log(data)
      log.info(`{signInUser()} started ,refID:${data.refId}`);
      console.log(data.user);
      const userSignIn = await this.userSignIn.userSignin(req.body, data.user , data.refId);
      //@ts-ignore
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: userSignIn.message,
        data: userSignIn.data,
        error: userSignIn.errorList,
      });
    } catch (ex) {
      log.error(`Excption occurred in {signInUser()} refId:${refid} ex:${ex}`);
    }
  };
}

// module.exports = SignInController;
export default SignInController;
