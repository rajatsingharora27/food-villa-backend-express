// res.locals.userDocument = isExistingUser; contains the user documnet means user
//is there and verified no need to call user again

import { Request, Response } from "express";
import { UserInputRequest } from "../Types/DataTypes";
import SignInUserService from "../service/signInUser";
import { StatusCodes } from "http-status-codes";

class SignInUserController {
  signUpUserService = new SignInUserService();
  userSign = async (req: Request, res: Response) => {
    // if controll reach her  usser exist and password is correct
    const refId = res.locals.refid;
    const userDocument: UserInputRequest = res.locals.userDocument;
    const userSignIn = await this.signUpUserService.signIn(req.body, userDocument, refId);
    console.log(userSignIn);
    res.status(StatusCodes.OK).json({
      refId,
      message: userSignIn.message,
      responseData: userSignIn.data,
    });
  };
}

export default SignInUserController;
