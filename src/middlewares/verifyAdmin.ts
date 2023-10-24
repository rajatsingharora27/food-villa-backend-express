import { NextFunction, Request, Response } from "express";
import userSignModel from "../model/userSignModel";
import { verifyToken } from "../utils/utilMethods";
import { VALIDATION_RESPONSE } from "../Types/APIResponse";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidV4 } from "uuid";
import logger from "../config/logger";

export const verifyAdminUser = (currentUrl: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers["authorization"];
    const refId = uuidV4();
    logger.info(`{verifyAdminUser()} middleware started  refId:${refId}`);
    let isTokenVerified: VALIDATION_RESPONSE;
    let messageList;
    try {
      if (authorizationHeader != undefined) {
        const tokenWithoutBearer = authorizationHeader.substring(7);
        isTokenVerified = verifyToken(tokenWithoutBearer, currentUrl);

        if (isTokenVerified.isValid == true) {
          res.locals.refid = refId;
          res.locals.isAdminAccess = true;
          next();
          return;
        } else {
          messageList = isTokenVerified.message;
        }
      }
    } catch (ex) {
      logger.error(`Exception occusrred in the  {verifyAdminUser()} middleware , refId:${refId} ,ex:${ex}`);

      res.status(StatusCodes.EXPECTATION_FAILED).json({
        refId,
        message: [`Exception occusrred in the  {verifyAdminUser()} middleware , refId:${refId} ,ex:${ex}`],
        data: {},
      });
    }
  };
};
