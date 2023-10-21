import jwt from "jsonwebtoken";
import { TokenInformationType } from "../Types/DataTypes";
import bcrypt from "bcrypt";
import logger from "../config/logger";

export const generateJWTtoken = (userObject: TokenInformationType) => {
  console.log(userObject);
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== undefined) {
    return jwt.sign(
      {
        data: {
          userName: userObject.userName,
          userId: userObject.userId,
          email: userObject.emailId,
          role: userObject.role,
        },
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
