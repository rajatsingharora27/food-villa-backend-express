import StatusCodes from "http-status-codes";
import { v4 as uuidV4 } from "uuid";
import { Request, Response } from "express";
import AddProductToCartOrWishListService from "../service/AddProductToCartOrWishListService";
import log from "../config/logger";

class AddProductToCartOrWishListController {
  addProductToCartOrWishList = new AddProductToCartOrWishListService();

  addProductToCartController = async (req: Request, res: Response) => {
    const refid = uuidV4();
    try {
      console.log(refid);
      const prductAddedResponse = await this.addProductToCartOrWishList.addProduct(req.body, refid);
      console.log(prductAddedResponse);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        // message: prductAddedResponse?.message,
        data: {},
        // error: prductAddedResponse?.errorList,
      });
    } catch (ex) {
      log.error(ex);
    }
  };
}

export default AddProductToCartOrWishListController;
