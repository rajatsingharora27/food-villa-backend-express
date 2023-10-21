import jwt, { JwtPayload } from "jsonwebtoken";
import { DECODE_TOKEN, TokenInformationType } from "../Types/DataTypes";
import bcrypt from "bcrypt";
import logger from "../config/logger";
import { API_RESPONSE, VALIDATION_RESPONSE } from "../Types/APIResponse";
import {
  EMAIL_ID_REQUIRES_0013,
  MINIMUM_USERNAME_LENGTH_0012,
  USER_ALREADY_EXIST_0007_1,
  USER_ALREADY_EXIST_0007_2,
  USER_NAME_IS_NESSARY_0008,
  USER_PASSWORD_IS_NESSARY_0009,
} from "../constants/errorMessage";
import userSignModel from "../model/userSignModel";
import { CART_ITEM_TYPE, SIGNUP_USER, VALIDATION_RETURN_VALUE } from "../Types/DataTypes";

export const generateJWTtoken = (userObject: TokenInformationType) => {
  console.log(userObject);
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== undefined) {
    return jwt.sign(
      {
        // data: {
        userName: userObject.userName,
        userId: userObject.userId,
        email: userObject.emailId,
        role: userObject.role,
        // },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
  }
};

export const generateHashPassword = (passoword: string) => {
  const saltRounds = process.env.SALT_ROUNDS;
  console.log(saltRounds);
  let hash: string = "";
  try {
    if (saltRounds != null && saltRounds != undefined) {
      hash = bcrypt.hashSync(passoword, parseInt(saltRounds));
    }
  } catch (ex) {
    logger.error(`Exception occurred {generateHashPassword()} ${ex}`);
  }

  return hash;
};

export const verifyToken = (token: string): VALIDATION_RESPONSE => {
  let tokenDeocdeValue;
  if (process.env.JWT_SECRET != undefined || process.env.JWT_SECRET != null) {
    tokenDeocdeValue = jwt.verify(token, process.env.JWT_SECRET) as DECODE_TOKEN;
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenDeocdeValue.exp != undefined && tokenDeocdeValue.exp < currentTime) {
      return {
        isValid: false,
        message: ["Token is expired please sign in again"],
        data: {},
      };
    } else if (tokenDeocdeValue.role != "admin") {
      return {
        isValid: false,
        message: ["Admin is allowed to delete the user"],
        data: {},
      };
    }

    return {
      isValid: true,
      message: ["user is validated"],
      data: {},
    };
  } else {
    return { isValid: false, message: ["Some error occurred"], data: {} };
  }
};

export const verifiedName = (userName: string, errorList: Array<string>): VALIDATION_RETURN_VALUE => {
  let isValidValue: boolean = false;
  if (userName == null) {
    errorList.push(USER_NAME_IS_NESSARY_0008);
  } else if (userName.trim().length < 2) {
    errorList.push(MINIMUM_USERNAME_LENGTH_0012);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
};

export const verifiedEmail = (emailId: string, errorList: string[]): VALIDATION_RETURN_VALUE => {
  let isValidValue: boolean = false;
  if (emailId == null) {
    errorList.push(EMAIL_ID_REQUIRES_0013);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
};

export const verifyRegistedUser = async (emailId: string, errorList: string[]): Promise<VALIDATION_RETURN_VALUE> => {
  const userFromDB = await userSignModel.findOne({ email: emailId });
  console.log(userFromDB);
  let isValidValue: boolean = false;
  if (userFromDB != null) {
    errorList.push(USER_ALREADY_EXIST_0007_1 + emailId + USER_ALREADY_EXIST_0007_2);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList, data: userFromDB };
};

export const verifyPassword = (password: string, errorList: string[]): VALIDATION_RETURN_VALUE => {
  let isValidValue: boolean = false;
  if (password == null) {
    errorList.push(USER_PASSWORD_IS_NESSARY_0009);
  } else if (password.trim().length == 0) {
    errorList.push(USER_PASSWORD_IS_NESSARY_0009);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
};

export const verifySignInPassword = (password: string, encrypted: string): boolean => {
  if (bcrypt.compareSync(password, encrypted)) {
    return true;
  }
  return false;
};
