import jwt from "jsonwebtoken";
import { C_W_ProdcutAdd, JwtTokenType } from "../Types/WislistType";
import log from "../config/logger";
import userWishListModel from "../model/userWishListModel";
import cartUserModel from "../model/cartUserModel";
import { VerifyCallback } from "jsonwebtoken";
import { reddis } from "../config/redisConfig";
import { TokenInformationType } from "../Types/TokenInformation";
import { TRUE } from "../constants/applicationConstants";

class AddProductToCartOrWishListService {
  addProduct = async (inputRequest: C_W_ProdcutAdd, refId: string) => {
    try {
      if (process.env.JWT_SECRET !== undefined) {
        const decode = jwt.verify(
          inputRequest.token,
          process.env.JWT_SECRET
        ) as JwtTokenType;
        if (decode) {
          if (decode.exp > Math.floor(Date.now() / 1000)) {
            console.log(decode.data);
            if (inputRequest.cartOrWishlist.toLowerCase() === "w") {
              this.addUserWishListProduct(decode, inputRequest, refId);
            } else if (inputRequest.cartOrWishlist.toLowerCase() === "c") {
              if (inputRequest.productToCartQuantity != null) {
                this.addToUserCartProduct(decode, inputRequest, refId);
              }
            }
          }
        }
      }
      return {
        isValid: true,
        errorList: [],
        message: ["updated"],
        error: [],
      };
    } catch (ex) {
      log.error(
        `Exception occurred in {{addProduct()}} refId${refId} , ex:${ex}`
      );
    }
  };

  private async addUserWishListProduct(
    tokenDecodedValue: JwtTokenType,
    inputRequest: C_W_ProdcutAdd,
    refId: string
  ) {
    const userWishlistDetails = await userWishListModel.findOne({
      email: tokenDecodedValue.data.email,
    });
    if (userWishlistDetails != null) {
      const currentWishListItemsUserHave = userWishlistDetails.wishlistItem;
      console.log(currentWishListItemsUserHave);
      let listOfItemsToBeAddedInWishList = [];

      const listIfItemIsAlreadyThere = currentWishListItemsUserHave.filter(
        (item: any) => item.product != inputRequest.productId
      );
      if (
        listIfItemIsAlreadyThere.length !== currentWishListItemsUserHave.length
      ) {
        // it the list of wishlist productnd filted item are not same
        //means user wants to remove from wish list
        listOfItemsToBeAddedInWishList = listIfItemIsAlreadyThere;
      } else {
        //new item is there to be added in wishList
        //@ts-ignore
        currentWishListItemsUserHave.push({
          product: inputRequest.productId,
          isPurchased: false,
        });
        listOfItemsToBeAddedInWishList = currentWishListItemsUserHave;
      }
      await userWishlistDetails.updateOne({
        wishlistItem: listOfItemsToBeAddedInWishList,
      });
      log.info(
        `Product added to the wishlist  productId:${inputRequest.productId} , refId:${refId}`
      );
    }
  }

  private async addToUserCartProduct(
    tokenDecodedValue: JwtTokenType,
    inputRequest: C_W_ProdcutAdd,
    refId: string
  ) {
    // get Detial from cartTable if user is there
    //if not create user document
    // add the product to the user
    // if present
    // and prodcut in the list
    try {
      const isUserInCartTable = await cartUserModel.findOne({
        email: tokenDecodedValue.data.email,
      });
      let cartList;
      console.log(isUserInCartTable);

      if (isUserInCartTable === null) {
        // First time user is adding in cart
        cartList = this.getCartList(inputRequest);

        const userCartObject = {
          userId: tokenDecodedValue.data.userId,
          email: tokenDecodedValue.data.email,
          cartItem: cartList,
        };

        const cartDetil = await cartUserModel.create(userCartObject);
        cartDetil.save();
      } else {
        const produtListUserAlreadyHasInCart =
          isUserInCartTable.cartItem.filter(
            (ele) => ele.product == inputRequest.productId
          );

        if (
          isUserInCartTable.cartItem.length !==
          produtListUserAlreadyHasInCart.length
        ) {
          // means new Product is request by user to add in cart
          cartList = this.getCartList(inputRequest);
        } else {
          // means user already has the product he is increasing or decreasing

          cartList = this.getCartList(
            inputRequest,

            produtListUserAlreadyHasInCart[0].quantity
          );
        }

        const userCartObject = {
          userId: tokenDecodedValue.data.userId,
          email: tokenDecodedValue.data.email,
          cartItem: cartList,
        };
        const cartDetil = await cartUserModel.updateOne(userCartObject);
      }
    } catch (ex) {
      log.error(
        `exception occurred in {{addToUserCartProduct()}}  refid:${refId}  , ex : ${ex}`
      );
    }
  }

  private getCartList(
    inputRequest: C_W_ProdcutAdd,
    prodcutEarlierQuantityInCart = 0
  ) {
    let userCartItem = [];
    let quantity;
    if (inputRequest.cartOrWishlist.toLowerCase() === "c") {
      if (
        (inputRequest.productToCartQuantity.decrease == true &&
          inputRequest.productToCartQuantity.increase == true) ||
        (inputRequest.productToCartQuantity.decrease === false &&
          inputRequest.productToCartQuantity.increase == false)
      ) {
        log.error("Both increase and decrese cannot have same value");
        throw Error("Both increase and decrese cannot have same value");
      } else {
        if (inputRequest.productToCartQuantity.increase === true) {
          quantity =
            inputRequest.productToCartQuantity.quantity +
            prodcutEarlierQuantityInCart;
        } else if (inputRequest.productToCartQuantity.decrease === true) {
          if (
            prodcutEarlierQuantityInCart >
            inputRequest.productToCartQuantity.quantity
          ) {
            quantity =
              prodcutEarlierQuantityInCart -
              inputRequest.productToCartQuantity.quantity;
          } else {
            quantity =
              inputRequest.productToCartQuantity.quantity -
              prodcutEarlierQuantityInCart;
          }

          if (quantity <= 0) {
            quantity = 0;
          }
        }
      }
    }
    userCartItem.push({
      product: inputRequest.productId,
      isPurchased: false,
      quantity: quantity,
    });
    return userCartItem;
  }
}
export default AddProductToCartOrWishListService;
