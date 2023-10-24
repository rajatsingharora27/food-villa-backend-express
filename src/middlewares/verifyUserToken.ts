import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/utilMethods";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidV4 } from "uuid";

export const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token;
  const refId = uuidV4();

  // if (req.body.wishlistAdd == false) {
  //   return res.status(StatusCodes.OK).json({
  //     refId,
  //     message: ["No need to update wish list"],
  //     data: {},
  //   });
  // }

  if (token != null && token.trim().length != 0) {
    const validateTokenResponse = verifyToken(token, "/wishlit-update");
    if (validateTokenResponse.isValid == false) {
      return res.status(StatusCodes.FORBIDDEN).json({
        refId,
        message: ["invalid token"],
        data: {},
      });
    } else {
      res.locals.tokenData = validateTokenResponse.data;
      res.locals.refid = refId;
      console.log(validateTokenResponse.data);
      next();
    }
  } else {
    return res.status(StatusCodes.FORBIDDEN).json({
      refId,
      message: ["Token must be provided"],
      data: {},
    });
  }
};
