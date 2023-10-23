import { DECODE_TOKEN, WISHLIST_ADD_BODY } from "../Types/DataTypes";
import logger from "../config/logger";
import userWishListModel from "../model/userWishListModel";
import { addToWishList } from "../utils/utilMethods";

class WishListUpdateService {
  updateWishList = async (inputRequest: WISHLIST_ADD_BODY, refId: string, tokenData: DECODE_TOKEN) => {
    try {
      let errorList: Array<string> = [];
      logger.info(`{updateWishList} Service started , refId:${refId}`);
      const dataRecived = await addToWishList(inputRequest.productId, tokenData.userId, tokenData.email, refId, errorList);
      console.log(dataRecived);
      return {
        refId,
        message: dataRecived.message,
        data: dataRecived.data,
      };
    } catch (ex) {
      logger.error(`Exception occurred in {updateWishList} ex:${ex}`);
      return {
        refId,
        message: [`Exception occurred in {updateWishList} ex:${ex}`],
        data: {},
      };
    }
  };
}

export default WishListUpdateService;
