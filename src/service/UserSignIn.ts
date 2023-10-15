import  log from "../config/logger";
import {generateJWTtoken} from "../utils/utilMethods";
import bcrypt from "bcrypt" ;
// const { false, true } = require("../constants/applicationConstants");
// const { USER_INCORRECT_PASSWORD } = require("../constants/errorMessage");
// const {  USER_SUCCESSFULLY_SIGNED_IN_0003_1, MESSAGE} = require("../constants/informationaMessage");


class UserSignIn {
  userSignin = async (userData:any, dataFromMiddleWare:any, refId:string) => {
    try {
      log.info(`{userSignin()} service started refId:${refId}}`);
      //In future add logic if admin or not then make the access futher
      const hashPassword = dataFromMiddleWare.user.password;
      if (!bcrypt.compareSync(userData.password, hashPassword)) {
        return {
          isValid: false,
          errorList: ["USER_INCORRECT_PASSWORD"],
          message: [],
        };
      }else{
        const token = generateJWTtoken(dataFromMiddleWare.user);
        console.log("USER_SUCCESSFULLY_SIGNED_IN_0003_1");
        return{
            isValid: true,
            token:token,
            errorList: [],
            message: ["USER_SUCCESSFULLY_SIGNED_IN_0003_1"],
        }
      }
    } catch (ex) {
        log.error(`Exception occurred in the {userSignin()} refId ,${refId} ex:${ex}`)

        return{
            isValid: false,
            data:{},
            errorList: [ex],
            message: [],
           
        }
    }
  };
}

// module.exports = UserSignIn;
export default UserSignIn;
