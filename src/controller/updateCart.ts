import { Request, Response } from "express";
import logger from "../config/logger";
import WishListUpdateService from "../service/wishListUpdateService";
import { StatusCodes } from "http-status-codes";
import UpdateCartService from "../service/cartUpdateService";

class UpdateCartController {
  private updateService = new UpdateCartService();
  // if "wishlistAdd": false stop at UI only from making the api call
  updateCartListDataOfUser = async (req: Request, res: Response) => {
    const refId = res.locals.refid;
    logger.info(`{updateCartListDataOfUser()} controller started , refId: ${refId}`);
    const tokenData = res.locals.tokenData;
    const data = await this.updateService.updateUserCart(req.body, refId, tokenData);
    res.status(StatusCodes.CREATED).json({
      refId,
      //   message: data.message,
      //   responseData: data.data,
    });
  };
}

export default UpdateCartController;
