import { Request, Response } from "express";
import DeleteRegisteredUserService from "../service/deleteUserService";
import logger from "../config/logger";
import { StatusCodes } from "http-status-codes";

class DeleteUserContoller {
  deleteRegisteredUserService = new DeleteRegisteredUserService();

  deleteUser = async (req: Request, res: Response) => {
    const refId = res.locals.refid;
    logger.info(` class: {{DeleteUserContoller}}  function:{deleteUser()}  started redId:${refId}`);
    //@ts-ignore
    const deleteUser = await this.deleteRegisteredUserService.deleteUser(req.query.emailId, refId);
    res.status(StatusCodes.OK).json({
      refId,
      message: deleteUser?.message,
      data: deleteUser?.data,
    });
  };
}

export default DeleteUserContoller;
