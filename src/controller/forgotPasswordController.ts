import { Request, Response } from "express";
import logger from "../config/logger";
import NewPasswordService from "../service/newPasswordService";
import { StatusCodes } from "http-status-codes";

class ForgotPasswordController {
  private newPasswordService = new NewPasswordService();
  forgotPassword = async (req: Request, res: Response) => {
    const refId = res.locals.refid;
    try {
      logger.info(`{forgotPassword} conroller started refId:${refId} `);
      const updatePassword = await this.newPasswordService.setPassword(req.body, refId);
      res.status(StatusCodes.CREATED).json({
        refId,
        message: updatePassword.message,
        data: updatePassword.data,
      });
    } catch (error) {
      logger.error(`Exception Occurred {forgotPassword} While trying to updating the password refId:${refId} ex:${error}`);
      res.status(StatusCodes.CREATED).json({
        refId,
        message: [`Exception Occurred While trying to updating the password`],
        data: {},
      });
    }
  };
}

export default ForgotPasswordController;
