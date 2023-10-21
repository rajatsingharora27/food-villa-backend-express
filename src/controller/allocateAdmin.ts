import logger from "../config/logger";
import { v4 as uuidV4 } from "uuid";
import AdminAllocateService from "../service/adminAllocateService";
import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";

class AdminAllocate {
  adminAllocateService = new AdminAllocateService();
  addAdmin = async (req: Request, res: Response) => {
    // const refId = uuidV4();
    const refId = res.locals.refid;
    logger.info(`{addAdmin()} controller started ${refId}`);

    const adminAllocatedResult = await this.adminAllocateService.registerAdmin(req.body, refId);
    res.status(StatusCodes.OK).json({
      refId,
      message: adminAllocatedResult.message,
      data: adminAllocatedResult.data,
    });
  };
}

export default AdminAllocate;
