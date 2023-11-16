import { Request, Response } from "express";
import { DECODE_TOKEN, PRODUCT_BODY } from "../Types/DataTypes";
import cartUserModel from "../model/cartUserModel";
import { getCartListItem } from "../utils/utilMethods";
import logger from "../config/logger";

class UpdateCartService {
  updateUserCart = async (inputRequest: PRODUCT_BODY, refId: string, tokenData: DECODE_TOKEN) => {
    console.log(inputRequest);
    console.log(tokenData);

    // userName?: string;
    // emailId: string;
    // password: string;
    // phoneNumber?: string;
    // cartItems?: Array<CART_ITEM_TYPE>;
    // wishListItems?: Array<string>;

    const userDocumentFromDb = {
      userName: tokenData.userName,
      email: tokenData.email,
      password: "",
      role: tokenData.role,
      userId: tokenData.userId,
    };
    console.log(inputRequest.productToCartQuantity);
    const nessaryData = {
      emailId: userDocumentFromDb.email,

      password: "",
      role: userDocumentFromDb.role,
      cartItems: inputRequest.productToCartQuantity,
    };

    //@ts-ignore
    getCartListItem(userDocumentFromDb, nessaryData);
    // const userCartDataDocument = await cartUserModel.findOne({ userId: tokenData.userId });
    // if (userCartDataDocument != null) {
    //   /**check if the product is present already ? then get that cartItem object
    //    * if inputRequest.productToCartQuantity.increase is true the add the data
    //    * else decrese
    //    *
    //    */
    // } else {
    //   // inputRequest.productToCartQuantity.map()
    //   const userCartObject = {
    //     userId: tokenData.userId,
    //     email: tokenData.email,
    //   };
    // }
  };

  updateUserCartItems = async (inputRequest: any, refId: string, tokenData: DECODE_TOKEN) => {
    const userCartDetailsDocument = await cartUserModel.findOne({ userId: tokenData.userId });

    let userCartItemList = [];

    if (userCartDetailsDocument != null) {
      const cartFromDb = userCartDetailsDocument.cartItem;
      const inputRequestCartItems = inputRequest.productToCartQuantity;
      let dbMap = new Map();
      let reqInputCartMap = new Map();
      cartFromDb.forEach((ele) => {
        dbMap.set(ele.productId, ele);
      });

      inputRequestCartItems.forEach((ele: any) => {
        reqInputCartMap.set(ele.productId, ele);
      });

      inputRequest.productToCartQuantity.forEach((ele: any) => {
        if (dbMap.has(ele.productId)) {
          // means user is sending the product which he has already
          // update with the new value
          userCartItemList.push(ele);
        } else {
          userCartItemList.push(ele);
        }
      });
      // iterate on db object to check if the user already has some items that are not present in the
      // requset sent by user
      for (let [key, value] of dbMap) {
        // console.log(key + " = " + value);
        if (!reqInputCartMap.has(key)) {
          userCartItemList.push(value);
        }
      }

      let cartListNew: any = [];

      userCartItemList.forEach((item) => {
        if (item.quantity > 0) {
          cartListNew.push(item);
        }
      });

      await cartUserModel.findOneAndUpdate({ userId: tokenData.userId }, { cartItem: cartListNew });
      logger.info("user Cart Updated");
    }
    return {
      message: [],
      data: userCartItemList,
    };
  };
}

export default UpdateCartService;
