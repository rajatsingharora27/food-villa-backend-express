import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { v4 as uuidV4 } from "uuid";
import UserSignUpService from "../service/userSignUp";
import logger from "../config/logger";
import { API_RESPONSE } from "../Types/APIResponse";

class SignUpController {
  userSignUp = new UserSignUpService();

  signUpUser = async (req: Request, res: Response) => {
    const refId = res.locals.refid;
    try {
      const userSignUp: API_RESPONSE = await this.userSignUp.userSignUp(req.body, refId);

      let data = this.generateResponseData(userSignUp);

      return res.status(StatusCodes.CREATED).json({
        refId,
        message: userSignUp.message,
        responseData: data,
      });
    } catch (ex) {
      logger.error(`Exeption occurred in creating user ${ex}`);
      return res.status(StatusCodes.CREATED).json({
        refId,
        message: [`Exeption occurred in creating user ${ex}`],
        responseData: {},
      });
    }
  };

  generateResponseData(userSignUp: API_RESPONSE) {
    const token = userSignUp.data.token;
    let wishlistItems = userSignUp.data.wishListItem?.map((ele) => {
      return ele;
    });
    let cartItems = userSignUp.data.cartItems?.map((ele) => {
      return {
        productId: ele.product,
        quantity: ele.quantity,
      };
    });

    return {
      token,
      wishlistItems,
      cartItems,
    };
  }
}

export default SignUpController;
