import { Request, Response } from "express";
import logger from "../config/logger";
import WishListUpdateService from "../service/wishListUpdateService";
import { StatusCodes } from "http-status-codes";

class WishListController {
  wishlistUpdateService = new WishListUpdateService();
  // if "wishlistAdd": false stop at UI only from making the api call
  updateWishListDataOfUser = async (req: Request, res: Response) => {
    const refId = res.locals.refid;
    logger.info(`{updateWishListDataOfUser()} controller started , refId: ${refId}`);
    const tokenData = res.locals.tokenData;
    const data = await this.wishlistUpdateService.updateWishList(req.body, refId, tokenData);
    res.status(StatusCodes.CREATED).json({
      refId,
      message: data.message,
      responseData: data.data,
    });
  };
}

export default WishListController;
