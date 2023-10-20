// const { false, true, USER_ROLE } = require("../constants/applicationConstants");
// const {
//   INVALID_EMAIL_FORMAT_0006_2,
//   INVALID_EMAIL_FORMAT_0006_1,
//   USER_ALREADY_EXIST_0007_2,
//   USER_ALREADY_EXIST_0007_1,
//   USER_NAME_IS_NESSARY_0009,
//   USER_NAME_IS_NESSARY_0008,
// } = require("../constants/errorMessage");

// const {
//   USER_SUCCESSFULLY_SIGNED_UP_0002_1,
//   USER_SUCCESSFULLY_SIGNED_UP_0002_2,
// } = require("../constants/informationaMessage");
import bcrypt from "bcrypt";

import log from "../config/logger";

import userSignupModel from "../model/userSignModel";
import { generateJWTtoken } from "../utils/utilMethods";
import { v4 as uuidV4 } from "uuid";
import cartUserModel from "../model/cartUserModel";

class UserSignUp {
  userSignup = async (userDetails: any, refId: any) => {
    log.info(`{userSignUp() started, refID ,${refId}}`);
    let errorList: Array<string> = [];
    try {
      const [isValidaEmailId, isValidName, isAlreadyEmailNotInDb, isValidPassword] = await Promise.all([
        this.#validateEmail(userDetails.emailId, errorList),
        this.#validateUserName(userDetails.userName, errorList),
        this.#validateUserInDB(userDetails.emailId, errorList),
        this.#validatePassword(userDetails.password, errorList),
      ]);

      if (isValidaEmailId && isValidName && isAlreadyEmailNotInDb && isValidPassword) {
        const UID = uuidV4();

        const userObject = {
          userName: userDetails.userName,
          email: userDetails.emailId,
          phoneNumber: userDetails.phoneNumber,
          password: this.#generateHashPassword(userDetails.password),
          role: "user",
          userId: UID,
        };
        const user = await userSignupModel.create(userObject);
        if (userDetails.cartItems != null && userDetails.cartItems.length != 0) {
          const userCartDetail = await cartUserModel.find({ email: userDetails.emailId });
          if (userCartDetail == null) {
            cartUserModel.create();
          }
        }

        //generate JWT token
        const token = generateJWTtoken(userObject);

        log.info(`user added successfully ${userObject.email} , refID ,${refId}}`);
        //Svae user in db when token is ready
        user.save();
        return {
          isValid: true,
          errorList: errorList,
          message: ["USER_SUCCESSFULLY_SIGNED_UP_0002_1" + userDetails.emailId + "USER_SUCCESSFULLY_SIGNED_UP_0002_2"],
          token,
        };
      } else {
        log.info(`Error adding user ${userDetails.emailId} , refID ,${refId}}`);
        return {
          isValid: false,
          errorList: errorList,
          message: [],
        };
      }
    } catch (ex) {
      log.error(`Exception occurred while adding user {{userSignup()}} refId:${refId}  ,ex:${ex}`);

      return {
        isValid: false,
        errorList: errorList,
        message: [],
      };
    }
  };

  #validateEmail(email: string, errorList: Array<string>) {
    const emailRegEx = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;

    if (!emailRegEx.test(email)) {
      errorList.push("INVALID_EMAIL_FORMAT_0006_1" + email, "INVALID_EMAIL_FORMAT_0006_2");
      return false;
    }
    return true;
  }

  async #validateUserInDB(emailId: string, errorList: Array<string>) {
    const userDetail = await userSignupModel.find({ email: emailId });
    console.log(userDetail);
    if (userDetail == null || userDetail.length == 0) {
      return true;
    } else {
      errorList.push("USER_ALREADY_EXIST_0007_1" + emailId + "USER_ALREADY_EXIST_0007_2");
      return false;
    }
  }

  #validateUserName(name: string, errorList: Array<string>) {
    if (name == null) {
      errorList.push("USER_NAME_IS_NESSARY_0008");
      return false;
    }
    return true;
  }

  #validatePassword(password: string, errorList: Array<string>) {
    if (password == null || password.trim().length == 0) {
      errorList.push("USER_NAME_IS_NESSARY_0009");
      return false;
    }
    return true;
  }

  #generateHashPassword(passoword: string) {
    const saltRounds = process.env.SALT_ROUNDS;
    console.log(saltRounds);
    let hash: string = "";
    try {
      if (saltRounds != null && saltRounds != undefined) {
        hash = bcrypt.hashSync(passoword, parseInt(saltRounds));
      }
    } catch (ex) {
      log.error(`Exception occurred {generateHashPassword()} ${ex}`);
    }

    return hash;
  }

  // #generateJWTtoken(userObject) {
  //   return jwt.sign(
  //     {
  //       data: {
  //         userName: userObject.userName,
  //         email: userObject.email,
  //         role: userObject.role,
  //       },
  //     },
  //     process.env.JWT_SECRET,
  //     { expiresIn: "2 days" }
  //   );
  // }
}

export default UserSignUp;
