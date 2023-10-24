import { SIGNUP_USER, TokenInformationType, UserInputRequest } from "../Types/DataTypes";
import cartUserModel from "../model/cartUserModel";
import userWishListModel from "../model/userWishListModel";
import { generateJWTtoken, getCartListItem } from "../utils/utilMethods";

class SignInUserService {
  signIn = async (inputRequest: SIGNUP_USER, userDocumentFromDb: UserInputRequest, refId: string) => {
    // if user is doing sign in with some thing in cart and wish list
    // take those elemnt in cart
    // get user info from  cart and add in the cart
    // if product is already in cart i.e before sigin in elements in cart and after sign in the element sin cart
    // take those element in wish list
    // get wish list elemet from wish list table

    const [isItemAddedToCart, isItemAddedToWishList] = await Promise.all([
      getCartListItem(userDocumentFromDb, inputRequest),
      this.getWishListItem(userDocumentFromDb, inputRequest),
    ]);

    const jwtTokenObject: TokenInformationType = {
      userName: userDocumentFromDb.userName,
      emailId: userDocumentFromDb.email,
      phoneNumber: userDocumentFromDb.phoneNumber != undefined ? userDocumentFromDb.phoneNumber : "",
      password: userDocumentFromDb.password,
      role: userDocumentFromDb.role,
      //@ts-ignore
      userId: userDocumentFromDb.userId,
    };
    const jwtToken = generateJWTtoken(jwtTokenObject);

    if (isItemAddedToWishList.isValid == false && isItemAddedToCart.isValid == false) {
      // means user did not pass any cart info and wishlist Info in request
      // in this case get the
      // check if the user wish list is already there and user cart list as well?
      // if yes then retuen

      const cartProduct: any = isItemAddedToCart.data != null ? isItemAddedToCart.data : [];
      const wishListProduct: any = isItemAddedToWishList.data != null ? isItemAddedToWishList.data : [];
      return {
        refId,
        message: {},
        data: {
          token: jwtToken,
          cartItem: cartProduct.cartItem,
          wishListItem: wishListProduct.wishlistItem,
        },
      };
    } else if (isItemAddedToWishList.isValid == true && isItemAddedToCart.isValid == false) {
      //means user passed only wishlist not cartItems
      const wishListProduct: any = isItemAddedToWishList.data != null ? isItemAddedToWishList.data : [];
      console.log(isItemAddedToCart.data);
      return {
        refId,
        message: {},
        data: {
          token: jwtToken,
          //@ts-ignore
          cartItem: isItemAddedToCart.data != null && isItemAddedToCart.data.cartItem ? isItemAddedToCart.data.cartItem : [],
          wishListItem: wishListProduct,
        },
      };
    } else if (isItemAddedToWishList.isValid == false && isItemAddedToCart.isValid == true) {
      //means user passed only cartItems not wishlist
      const cartProduct: any = isItemAddedToCart.data != null ? isItemAddedToCart.data : [];
      console.log("cartProduct =>>>>>>", cartProduct);
      return {
        refId,
        message: {},
        data: {
          token: jwtToken,
          cartItem: cartProduct,
          //@ts-ignore
          wishListItem: isItemAddedToWishList.data != null && isItemAddedToWishList.data.wishlistItem != null ? isItemAddedToWishList.data.wishlistItem : [],
        },
      };
    }
    return {
      refId,
      message: {},
      data: {
        token: jwtToken,
        cartItem: isItemAddedToCart.data != null ? isItemAddedToCart.data : [],
        wishListItem: isItemAddedToWishList.data != null ? isItemAddedToWishList.data : [],
      },
    };
  };

  private async getWishListItem(userDocumentFromDb: UserInputRequest, inputRequest: SIGNUP_USER) {
    // here in this function if the wishlist Item field in request are not empty
    const userInWishLsitTable = await userWishListModel.findOne({ userId: userDocumentFromDb.userId });
    console.log(userInWishLsitTable);
    if (inputRequest.wishListItems != null && inputRequest.wishListItems.length != 0) {
      if (userInWishLsitTable) {
        // means user is in wishlist table in DB
        let set = new Set();
        userInWishLsitTable.wishlistItem;

        // gettting from db document
        userInWishLsitTable.wishlistItem.forEach((ele) => {
          set.add(ele.product);
        });

        inputRequest.wishListItems?.forEach((ele: any) => {
          set.add(ele.product);
        });

        let arr = Array.from(set);
        let finalWishListArray = arr.map((ele) => {
          return { product: ele };
        });

        // arr-> contails the wishlist  elemnets
        await userWishListModel.updateOne(
          { userId: userDocumentFromDb.userId },
          {
            $set: {
              wishlistItem: finalWishListArray,
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
    } else {
      return {
        isValid: false,
        message: ["No data to be adde in wishlist"],
        data: userInWishLsitTable,
      };
    }
  }
}

export default SignInUserService;
