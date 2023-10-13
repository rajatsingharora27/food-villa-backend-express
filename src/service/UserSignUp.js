const { FALSE, TRUE } = require("../constants/applicationConstants");
const {
  INVALID_EMAIL_FORMAT_0006_2,
  INVALID_EMAIL_FORMAT_0006_1,
  USER_ALREADY_EXIST_0007_2,
  USER_ALREADY_EXIST_0007_1,
} = require("../constants/errorMessage");

const {
  USER_SUCCESSFULLY_SIGNED_UP_0002_1,
  USER_SUCCESSFULLY_SIGNED_UP_0002_2
}=require("../constants/informationaMessage")


const userSignupModel = require("../model/userSignModel");

class UserSignUp {
  userSignup = async (userDetails) => {
    let errorList = [];
    const [isValidaEmailId, isValidName, isAlreadyEmailNotInDb] =
      await Promise.all([
        this.#validateEmail(userDetails.emailId, errorList),
        this.#validateUserName(userDetails.userName, errorList),
        this.#validateUserInDB(userDetails.emailId, errorList),
      ]);

    if (isValidaEmailId && isValidName && isAlreadyEmailNotInDb) {
      const userObject ={
        userName:userDetails.userName,
        email:userDetails.emailId,
        password:userDetails.password,
        phoneNumber:userDetails.phoneNumber
      }
      const user = await userSignupModel.create(userObject);
      user.save();
      return {
        isValid: TRUE,
        errorList: errorList,
        message: [
          USER_SUCCESSFULLY_SIGNED_UP_0002_1 +
            userDetails.emailId +
            USER_SUCCESSFULLY_SIGNED_UP_0002_2,
        ],
      };
    } else {
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
    const userDetail = await userSignupModel.find({email:emailId})
    console.log(userDetail)
    if (userDetail == null || userDetail.length==0) {
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
}

module.exports = UserSignUp;
