 import UserWishListService from "../service/UserWishListService";
 import StatusCodes  from "http-status-codes";
 import {v4 as uuidV4} from 'uuid';
 import log from "../config/logger";

const refid = uuidV4();
class WishListController {  
  userWishList = new UserWishListService();

  addToUserWishList = async (req:any, res:any) => {
    try {
      log.info(`{addToUserWishList()} started ,refID:${refid}`);
      const userWishList= await this.userWishList.addToWishList(req.body, res, refid);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: userWishList.message,
        data: {},
        error: userWishList.errorList,
      });
    } catch (ex) {
      log.error(`Excption occurred in {addToUserWishList()} refId:${refid} ex:${ex}`);
    }
  };
}

export default WishListController;
