import { Request, Response } from "express";
import { DECODE_TOKEN, PRODUCT_BODY } from "../Types/DataTypes";
import cartUserModel from "../model/cartUserModel";
import { getCartListItem } from "../utils/utilMethods";

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
}

export default UpdateCartService;
