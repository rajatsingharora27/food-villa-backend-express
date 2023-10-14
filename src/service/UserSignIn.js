const log = require("../config/logger");
const { FALSE, TRUE } = require("../constants/applicationConstants");
const { USER_INCORRECT_PASSWORD } = require("../constants/errorMessage");
const {  USER_SUCCESSFULLY_SIGNED_IN_0003_1, MESSAGE} = require("../constants/informationaMessage");
const { jwtToken } = require("../utils/utilMethods");
const bcrypt = require("bcrypt");

class UserSignIn {
  userSignin = async (userData, dataFromMiddleWare, refId) => {
    try {
      log.info(`{userSignin()} service started refId:${refId}}`);
      //In future add logic if admin or not then make the access futher
      const hashPassword = dataFromMiddleWare.user.password;
      if (!bcrypt.compareSync(userData.password, hashPassword)) {
        return {
          isValid: FALSE,
          errorList: [USER_INCORRECT_PASSWORD],
          message: [],
        };
      }else{
        const token = jwtToken(dataFromMiddleWare.user);
        console.log(MESSAGE);
        return{
            isValid: TRUE,
            token:token,
            errorList: [],
            message: [MESSAGE],
        }
      }
    } catch (ex) {
        log.error(`Exception occurred in the {userSignin()} refId ,${refId} ex:${ex}`)

        return{
            isValid: FALSE,
            data:{},
            errorList: [ex],
            message: [],
           
        }
    }
  };
}

module.exports = UserSignIn;
