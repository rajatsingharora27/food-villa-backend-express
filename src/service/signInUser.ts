import { SIGNUP_USER, UserInputRequest } from "../Types/DataTypes";
import cartUserModel from "../model/cartUserModel";
import userWishListModel from "../model/userWishListModel";

class SignInUserService {
  signIn = (inputRequest: SIGNUP_USER, userDocumentFromDb: UserInputRequest, redId: string) => {
    // if user is doing sign in with some thing in cart and wish list
    // take those elemnt in cart
    // get user info from  cart and add in the cart
    // if product is already in cart i.e before sigin in elements in cart and after sign in the element sin cart
    // take those element in wish list
    // get wish list elemet from wish list table

    if (inputRequest.wishListItems != null && inputRequest.wishListItems.length == 0) {
      this.getWishListItem(userDocumentFromDb, inputRequest);
    }

    if (inputRequest.cartItems != null && inputRequest.cartItems.length == 0) {
      this.getCartListItem(userDocumentFromDb, inputRequest);
    }
  };

  private async getWishListItem(userDocumentFromDb: UserInputRequest, inputRequest: SIGNUP_USER) {
    // here in this function if the wishlist Item field in request are not empty
    const userInWishLsitTable = await userWishListModel.findOne({ userId: userDocumentFromDb.userId });

    if (userInWishLsitTable != null) {
      // means user is in wishlist table in DB
      let set = new Set();
      userInWishLsitTable.wishlistItem;

      // gettting from db document
      userInWishLsitTable.wishlistItem.forEach((ele) => {
        set.add(ele);
      });

      inputRequest.wishListItems?.forEach((ele) => {
        set.add(ele);
      });

      let arr = Array.from(set);

      // arr-> contails the wishlist  elemnets
      await userWishListModel.updateOne(
        { userId: userDocumentFromDb.userId },
        {
          $set: {
            wishlistItem: arr,
          },
        }
      );
      return {
        isValid: true,
        message: ["WishList updated"],
        data: arr,
      };
    } else {
      // user is not in wish list

      const userWihsListObject = {
        userId: userDocumentFromDb.userId,
        email: userDocumentFromDb.email,
        wishlistItem: inputRequest.wishListItems,
      };

      const wishListUser = await userWishListModel.create(userWihsListObject);
      wishListUser.save();

      return {
        isValid: true,
        message: ["WishList updated"],
        data: inputRequest.wishListItems,
      };
    }
  }

  private async getCartListItem(userDocumentFromDb: UserInputRequest, inputRequest: SIGNUP_USER) {
    // here in this function because while siging in user already has something in cart
    const userCartDetailsDocument = await cartUserModel.findOne({ userId: userDocumentFromDb.userId });

    if (userCartDetailsDocument != null) {
      // user has alsedy something in cart
      let currentCartItems = userCartDetailsDocument.cartItem;
      let map = new Map();
      currentCartItems.forEach((ele) => {
        map.set(ele.product, ele);
      });

      inputRequest.cartItems?.forEach((ele) => {
        let productId = ele.productId;
        if (map.has(productId)) {
          // if user already has same product in cart and adde same while siging in
          let updatedCartItem = {
            product: productId,
            isPurchased: false,
            quantity: ele.qunatity + map.get(productId).quantity,
          };
          map.set(productId, updatedCartItem);
        } else {
          // its a new product diffrent form what user already has
          map.set(ele.productId, ele);
        }
      });

      // map -> has all the prodcuct

      let arr = [];

      for (const [key, value] of map) {
        console.log(key, "--->", value);
        arr.push(value);
      }

      await cartUserModel.updateOne(
        { userId: userDocumentFromDb.userId },
        {
          $set: {
            cartItem: arr,
          },
        }
      );

      return {
        isValid: true,
        message: ["Cart updated"],
        data: arr,
      };
    } else {
      const newCartItem = {
        userId: userDocumentFromDb.userId,
        email: userDocumentFromDb.email,
        cartItem: inputRequest.cartItems,
      };
      const newCartItemToBeAddedInCartTable = await cartUserModel.create(newCartItem);
      newCartItemToBeAddedInCartTable.save();
      return {
        isValid: true,
        message: ["WishList updated"],
        data: inputRequest.cartItems,
      };
    }
  }
}

export default SignInUserService;
