import { SIGNUP_USER, TokenInformationType, UserInputRequest } from "../Types/DataTypes";
import userSignModel from "../model/userSignModel";
import { v4 as uuidV4 } from "uuid";
import { generateJWTtoken } from "../utils/utilMethods";
import logger from "../config/logger";
import { API_RESPONSE } from "../Types/APIResponse";
import { USER_SUCCESSFULLY_ADMIN_CREATED_0004_1 } from "../constants/informationaMessage";

class AdminAllocateService {
  registerAdmin = async (inputRequest: TokenInformationType, refId: string): Promise<API_RESPONSE> => {
    try {
      logger.info(`{registerAdmin()} statreted Successfully  refId:${refId}`);
      const user_refId = "UID" + uuidV4();
      const adminObject = {
        userName: inputRequest.userName,
        userId: user_refId,
        email: inputRequest.emailId,
        phoneNumber: inputRequest.phoneNumber,
        password: generateJWTtoken(inputRequest),
        role: "admin",
      };
      await userSignModel.create(adminObject);
      const token = generateJWTtoken(inputRequest);
      return {
        refId,
        message: [USER_SUCCESSFULLY_ADMIN_CREATED_0004_1 + inputRequest.emailId],
        data: { token: token != undefined ? token : "" },
      };
    } catch (ex) {
      logger.error(`exception occurred while creating admin , refid:${refId}  , ex: ${ex}`);
      return {
        refId,
        message: [`exception occurred while creating admin , refid:${refId}  , ex: ${ex}`],
        data: { token: "" },
      };
    }
  };
}

export default AdminAllocateService;
