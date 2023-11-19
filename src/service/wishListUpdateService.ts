import { DECODE_TOKEN, WISHLIST_ADD_BODY } from "../Types/DataTypes";
import logger from "../config/logger";
import userWishListModel from "../model/userWishListModel";
import { addToWishList } from "../utils/utilMethods";

class WishListUpdateService {
  updateWishList = async (inputRequest: WISHLIST_ADD_BODY, refId: string, tokenData: DECODE_TOKEN) => {
    try {
      let dataRecived;
      let errorList: Array<string> = [];
      logger.info(`{updateWishList} Service started , refId:${refId}`);
      if (inputRequest.wishlistAdd == false) {
        dataRecived = await removeFromWishList(inputRequest.productId, tokenData.userId, refId, errorList);
      } else {
        dataRecived = await addToWishList(inputRequest.productId, tokenData.userId, tokenData.email, refId, errorList);
      }

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

async function removeFromWishList(productId: string[], userId: string, refId: string, errorList: string[]) {
  const updatedData = await userWishListModel.findOneAndUpdate(
    {
      userId: userId,
    },
    {
      $pull: {
        wishlistItem: {
          product: productId,
        },
      },
    },
    { new: true }
  );

  let updateWihslistArr: any = [];
  if (updatedData != null && updatedData.wishlistItem.length > 0) {
    updateWihslistArr = updatedData.wishlistItem.map((ele) => {
      return ele.product;
    });
  }
  return {
    isValid: true,
    message: ["Udated the wishlist"],
    data: updateWihslistArr,
  };
}

export default WishListUpdateService;
