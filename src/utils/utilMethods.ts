import jwt, { JwtPayload } from "jsonwebtoken";
import { DECODE_TOKEN, TokenInformationType } from "../Types/DataTypes";
import bcrypt from "bcrypt";
import logger from "../config/logger";
import { API_RESPONSE, VALIDATION_RESPONSE } from "../Types/APIResponse";

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
