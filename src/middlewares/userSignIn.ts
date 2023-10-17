import userSignupModel from "../model/userSignModel";
import  StatusCodes from "http-status-codes";
import  { v4 as uuidv4 } from "uuid";
import log from "../config/logger";
import {
  USER_NOT_FOUND_0010_1,
  USER_NOT_FOUND_0010_2,
}
from "../constants/errorMessage";
const refid = uuidv4();

export const verifyUserDetails = async (req:any, res:any, next:any) => {
  try {
    const user = await userSignupModel.findOne({ email: req.body.emailId });
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        refid: refid,
        message: {},
        data: {},
        error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
      });
    }else{
        let obj={
            refId:refid,
            user:user,
        }
        res.userData=obj
    }
    next();
  } catch (ex) {
    log.error(`Exception occurrecd due to  ,${ex} `);

    return res.status(StatusCodes.NOT_FOUND).json({
      refid: refid,
      message: {},
      data: {},
      error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
    });
  }
};



// module.exports = {
//   verifyUserSignUpDetailMiddleWare: verifyUserDetails,
  
// };
