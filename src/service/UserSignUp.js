const { FALSE, TRUE, USER_ROLE } = require("../constants/applicationConstants");
const {
  INVALID_EMAIL_FORMAT_0006_2,
  INVALID_EMAIL_FORMAT_0006_1,
  USER_ALREADY_EXIST_0007_2,
  USER_ALREADY_EXIST_0007_1,
  USER_NAME_IS_NESSARY_0009,
  USER_NAME_IS_NESSARY_0008,
} = require("../constants/errorMessage");

const {
  USER_SUCCESSFULLY_SIGNED_UP_0002_1,
  USER_SUCCESSFULLY_SIGNED_UP_0002_2,
} = require("../constants/informationaMessage");
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;
const log = require("../config/logger");

const userSignupModel = require("../model/userSignModel");
const {jwtToken} =require("../utils/utilMethods")


class UserSignUp {
  userSignup = async (userDetails, refId) => {
    log.info(`{userSignUp() started, refID ,${refId}}`);
    let errorList = [];
    try {
      const [
        isValidaEmailId,
        isValidName,
        isAlreadyEmailNotInDb,
        isValidPassword,
      ] = await Promise.all([
        this.#validateEmail(userDetails.emailId, errorList),
        this.#validateUserName(userDetails.userName, errorList),
        this.#validateUserInDB(userDetails.emailId, errorList),
        this.#validatePassword(userDetails.password, errorList),
      ]);

      if (
        isValidaEmailId &&
        isValidName &&
        isAlreadyEmailNotInDb &&
        isValidPassword
      ) {
        const userObject = {
          userName: userDetails.userName,
          email: userDetails.emailId,
          password: userDetails.password,
          phoneNumber: userDetails.phoneNumber,
          password: this.#generateHashPassword(userDetails.password),
          role: USER_ROLE,
        };
        const user = await userSignupModel.create(userObject);
  
        //generate JWT token
        const token = jwtToken(userObject);

        log.info(
          `user added successfully ${userObject.email} , refID ,${refId}}`
        );
        //Svae user in db when token is ready
        user.save();
        return {
          isValid: TRUE,
          errorList: errorList,
          message: [
            USER_SUCCESSFULLY_SIGNED_UP_0002_1 +
              userDetails.emailId +
              USER_SUCCESSFULLY_SIGNED_UP_0002_2,
          ],
          token,
        };
      } else {
        log.info(`Error adding user ${userDetails.emailId} , refID ,${refId}}`);
        return {
          isValid: FALSE,
          errorList: errorList,
          message: [],
        };
      }
    } catch (ex) {
      log.error(
        `Exception occurred while adding user refId:${refId}  ,ex:${ex}`
      );

      return {
        isValid: FALSE,
        errorList: errorList,
        message: [],
      };
    }
  };

  #validateEmail(email, errorList) {
    const emailRegEx = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;

    if (!emailRegEx.test(email)) {
      errorList.push(
        INVALID_EMAIL_FORMAT_0006_1 + email,
        INVALID_EMAIL_FORMAT_0006_2
      );
      return FALSE;
    }
    return TRUE;
  }

  async #validateUserInDB(emailId, errorList) {
    const userDetail = await userSignupModel.find({ email: emailId });
    console.log(userDetail);
    if (userDetail == null || userDetail.length == 0) {
      return TRUE;
    } else {
      errorList.push(
        USER_ALREADY_EXIST_0007_1 + emailId + USER_ALREADY_EXIST_0007_2
      );
      return FALSE;
    }
  }

  #validateUserName(name, errorList) {
    if (name == null) {
      errorList.push(USER_NAME_IS_NESSARY_0008);
      return FALSE;
    }
    return TRUE;
  }

  #validatePassword(password, errorList) {
    if (password == null || password.trim().length == 0) {
      errorList.push(USER_NAME_IS_NESSARY_0009);
      return FALSE;
    }
    return TRUE;
  }

  #generateHashPassword(passoword) {
    const hash = bcrypt.hashSync(passoword, parseInt(saltRounds));
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

module.exports = UserSignUp;
