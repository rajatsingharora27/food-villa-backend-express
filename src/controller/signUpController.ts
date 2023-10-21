import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { v4 as uuidV4 } from "uuid";
import UserSignUpService from "../service/userSignUp";
import logger from "../config/logger";
import { API_RESPONSE } from "../Types/APIResponse";

class SignUpController {
  userSignUp = new UserSignUpService();

  signUpUser = async (req: Request, res: Response) => {
    try {
      const refId = res.locals.refid;
      const userSignUp: API_RESPONSE = await this.userSignUp.userSignUp(req.body, refId);
      console.log(userSignUp);
      let data = this.generateResponseData(userSignUp);
      console.log(data);
      return res.status(StatusCodes.OK).json({
        refId,
        message: userSignUp.message,
        data,
      });
    } catch (ex) {
      logger.error(`${ex}`);
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
