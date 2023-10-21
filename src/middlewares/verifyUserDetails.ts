import { NextFunction, Request, Response } from "express";
import { CART_ITEM_TYPE, SIGNUP_USER, VALIDATION_RETURN_VALUE } from "../Types/DataTypes";
import logger from "../config/logger";
import { v4 as uuidV4 } from "uuid";
import {
  EMAIL_ID_REQUIRES_0013,
  MINIMUM_USERNAME_LENGTH_0012,
  USER_ALREADY_EXIST_0007_1,
  USER_ALREADY_EXIST_0007_2,
  USER_NAME_IS_NESSARY_0008,
  USER_PASSWORD_IS_NESSARY_0009,
} from "../constants/errorMessage";
import userSignModel from "../model/userSignModel";
import { API_RESPONSE } from "../Types/APIResponse";
import StatusCodes from "http-status-codes";

const verifyUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  let errorList: Array<string> = [];
  const reqBody: SIGNUP_USER = req.body;
  const refid = uuidV4();
  try {
    logger.info(`{verifyUserDetails()} middleware started , refId:${refid}`);

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
      // console.log("moving after next");
    }
    console.log("moving after next");
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

function verifiedName(userName: string, errorList: Array<string>): VALIDATION_RETURN_VALUE {
  let isValidValue: boolean = false;
  if (userName == null) {
    errorList.push(USER_NAME_IS_NESSARY_0008);
  } else if (userName.trim().length < 2) {
    errorList.push(MINIMUM_USERNAME_LENGTH_0012);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
}

function verifiedEmail(emailId: string, errorList: string[]): VALIDATION_RETURN_VALUE {
  let isValidValue: boolean = false;
  if (emailId == null) {
    errorList.push(EMAIL_ID_REQUIRES_0013);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
}

async function verifyRegistedUser(emailId: string, errorList: string[]): Promise<VALIDATION_RETURN_VALUE> {
  const userFromDB = await userSignModel.findOne({ email: emailId });
  let isValidValue: boolean = false;
  if (userFromDB != null) {
    errorList.push(USER_ALREADY_EXIST_0007_1 + emailId + USER_ALREADY_EXIST_0007_2);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
}

function verifyPassword(password: string, errorList: string[]): VALIDATION_RETURN_VALUE {
  let isValidValue: boolean = false;
  if (password == null) {
    errorList.push(USER_PASSWORD_IS_NESSARY_0009);
  } else if (password.trim().length == 0) {
    errorList.push(USER_PASSWORD_IS_NESSARY_0009);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
}

export default verifyUserDetails;
