import { NextFunction, Request, Response } from "express";
import { CART_ITEM_TYPE, SIGNUP_USER, VALIDATION_RETURN_VALUE } from "../Types/DataTypes";
import logger from "../config/logger";
import { v4 as uuidV4 } from "uuid";

import StatusCodes from "http-status-codes";
import { verifiedEmail, verifiedName, verifyPassword, verifyRegistedUser } from "../utils/utilMethods";

const verifyUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  let errorList: Array<string> = [];
  const reqBody: SIGNUP_USER = req.body;
  const refid = uuidV4();
  try {
    logger.info(`{verifyUserDetails()} middleware started , refId:${refid}`);
    if (reqBody.userName == undefined) return;
    const [verifyUserName, verifyUserEmai, isUserAlredyRegistered, isValidPassword] = await Promise.all([
      verifiedName(reqBody.userName, errorList),
      verifiedEmail(reqBody.emailId, errorList),
      verifyRegistedUser(reqBody.emailId, errorList),
      verifyPassword(reqBody.password, errorList),
    ]);

    if (verifyUserName.isValid && verifyUserEmai.isValid && isUserAlredyRegistered.isValid && isValidPassword.isValid) {
      res.locals.refid = refid;

      next();
      return;
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      refId: refid,
      message: errorList,
      data: {},
    });
  } catch (ex) {
    logger.error(`Exception occurred in verifyUserDetails  error:${ex}`);
    throw new Error(`Exception occurred in verifyUserDetails  error:${ex}`);
  }
};

export default verifyUserDetails;
