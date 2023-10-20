import jwt from "jsonwebtoken";
import { TokenInformationType } from "../Types/DataTypes";

export const generateJWTtoken = (userObject: TokenInformationType) => {
  console.log(userObject);
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== undefined) {
    return jwt.sign(
      {
        data: {
          userName: userObject.userName,
          userId: userObject.userId,
          email: userObject.email,
          role: userObject.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
  }
};
