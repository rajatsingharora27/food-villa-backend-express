import UserCartListService from "../service/UserCartListService";
import StatusCodes  from "http-status-codes";
import {v4 as uuidV4} from 'uuid';
import log from "../config/logger";
import { Request, Response } from "express";

const refid = uuidV4();
class UserCartistController {  
 userCartListService = new UserCartListService();


 //When user signs in then only store the information to DB
 //If not a signed in user store details in the UI seerion and 
 // connect to backend in case of the payment
 addToCartList = async (req:Request, res:Response) => {
   try {
     log.info(`{addToCartList()} started ,refID:${refid}`);
     const userCartList= await this.userCartListService.addToCartList(req.params.productId, res,refid);
     return res.status(StatusCodes.OK).json({
       refid: refid,
    //    message: userCartList.message,
       data: {},
    //    error: userCartList.errorList,
     });
   } catch (ex) {
     log.error(`Excption occurred in {addToUserWishList()} refId:${refid} ex:${ex}`);
   }
 };
}

export default UserCartistController;