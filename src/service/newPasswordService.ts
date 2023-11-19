import logger from "../config/logger";
import { FALSE, TRUE } from "../constants/applicationConstants";
import userSignModel from "../model/userSignModel";
import { generateHashPassword } from "../utils/utilMethods";

class NewPasswordService {
  setPassword = async (inputRequest: any, refId: string) => {
    try {
      const userExist = await userSignModel.findOne({ email: inputRequest.emailId });
      if (userExist == null) {
        return {
          isValid: FALSE,
          message: [`User With email ${inputRequest.emailId} dose not exist please try again`],
          data: {},
        };
      } else {
        const hashedPassword = generateHashPassword(inputRequest.password);
        await userSignModel.updateOne({ email: inputRequest.emailId }, { $set: { password: hashedPassword } });
        return {
          isValid: TRUE,
          message: [`Passsword Updated successfully`],
          data: {},
        };
      }
    } catch (ex) {
      logger.error(`Exception Occurred While trying to updating the password refId:${refId} ex:${ex}`);
      return {
        isValid: FALSE,
        message: [`Exception Occurred While trying to updating the password refId:${refId} ex:${ex}`],
        data: {},
      };
    }
  };
}

export default NewPasswordService;
