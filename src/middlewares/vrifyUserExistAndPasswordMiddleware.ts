import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import logger from "../config/logger";
// import { v4 as uuidV4 } from "uuid";
import userSignModel from "../model/userSignModel";
import { StatusCodes } from "http-status-codes";
import { USER_INCORRECT_PASSWORD, USER_NOT_FOUND_0010_1, USER_NOT_FOUND_0010_2 } from "../constants/errorMessage";
import { verifySignInPassword } from "../utils/utilMethods";

const vrifyUserExistAndPassWord = async (req: Request, res: Response, next: NextFunction) => {
  const refId = res.locals.refid;
  logger.info(`{{vrifyUserExistAndPassWord}} middleware started refId: ${refId}`);

  const isExistingUser = await userSignModel.findOne({ email: req.body.emailId });

  if (isExistingUser == null) {
    return res.status(StatusCodes.FORBIDDEN).json({
      refId,
      message: [USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2],
      data: {},
    });
  } else {
    const isPasswordVarified = verifySignInPassword(req.body.password, isExistingUser.password);
    if (isPasswordVarified) {
      res.locals.userDocument = isExistingUser;
      next();
      return;
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        refId,
        message: [USER_INCORRECT_PASSWORD],
        data: {},
      });
    }
  }
};

export default vrifyUserExistAndPassWord;
