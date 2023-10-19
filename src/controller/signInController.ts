import UserSignIn from "../service/UserSignIn";
import StatusCodes from "http-status-codes";
import { v4 as uuidV4 } from "uuid";
import log from "../config/logger";
import { Request, Response } from "express";
import { UserData } from "../Types/SigninMiddlewareResponseSentType";
import { TokenInformationType } from "../Types/TokenInformation";
import jwt from "jsonwebtoken";

// const refid = uuidV4();`

class SignInController {
  userSignIn = new UserSignIn();

  signInUser = async (req: Request, res: Response | any) => {
    let refId: string = "";
    try {
      console.log(req.body);
      const data = res.userData;
      refId = data.refId;

      const extractedInformationOfUser: TokenInformationType = {
        refId: refId,
        userId: data.user.userId,
        userName: data.user.userName,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        role: data.user.role,
        password: data.user.password,
      };
      console.log(data);
      log.info(`{signInUser()} started ,refID:${refId}`);
      // console.log(data.user);
      const userSignIn = await this.userSignIn.userSignin(
        req.body,
        extractedInformationOfUser,
        data.refId
      );
      //@ts-ignore
      return res.status(StatusCodes.OK).json({
        refid: extractedInformationOfUser.refId,
        message: userSignIn.message,
        data: userSignIn.data,
        error: userSignIn.errorList,
      });
    } catch (ex) {
      log.error(`Excption occurred in {signInUser()} refId:${refId} ex:${ex}`);
    }
  };
}

// module.exports = SignInController;
export default SignInController;
