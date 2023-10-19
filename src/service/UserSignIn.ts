import log from "../config/logger";
import { generateJWTtoken } from "../utils/utilMethods";
import bcrypt from "bcrypt";
import { FALSE, TRUE } from "../constants/applicationConstants";
import { USER_INCORRECT_PASSWORD } from "../constants/errorMessage";
import { USER_SUCCESSFULLY_SIGNED_IN_0003_1 } from "../constants/informationaMessage";
import { UserReposneFromMiddleWare } from "../Types/SigninMiddlewareResponseSentType";
import userWishListModel from "../model/userWishListModel";
import cartUserModel from "../model/cartUserModel";
import productDetailModel from "../model/productDetailModel";
import { UserWishList, WishListOfUser } from "../Types/WislistType";
import { TokenInformationType } from "../Types/TokenInformation";

class UserSignIn {
  userSignin = async (
    userData: any,
    dataFromMiddleWare: TokenInformationType,
    refId: string
  ) => {
    try {
      log.info(`{userSignin()} service started refId:${refId}}`);
      console.log(dataFromMiddleWare);
      //In future add logic if admin or not then make the access futher
      const hashPassword = dataFromMiddleWare.password;
      if (!bcrypt.compareSync(userData.password, hashPassword)) {
        return {
          isValid: false,
          errorList: [USER_INCORRECT_PASSWORD],
          message: [],
        };
      } else {
        const token = generateJWTtoken(dataFromMiddleWare);
        console.log(USER_SUCCESSFULLY_SIGNED_IN_0003_1);

        //get the wishlist data and the cart data of the user and return
        const [userWishListDetails, userCartDetails] = await Promise.all([
          // this.getUserDetils(dataFromMiddleWare),
          this.getUserWishList(dataFromMiddleWare),
          this.getUserCartDetils(dataFromMiddleWare),
        ]);

        

        let wishListProductList: Array<string>=[];
        let cartListProduct: Array<string> = [];

        if (userWishListDetails !== null) {
          wishListProductList = userWishListDetails.wishlistItem.map((ele: any) => {
            return ele.product;
          });
        }

        

        const[wishlist]=await Promise.all([
        this.getAllWishListProductItems(wishListProductList),
        // this.getAllCartProductItems(userCartDetails)
        ]);
        

        const responseDataTosend={
          token:token,
          wishlist:wishlist
        }

        return {
          isValid: TRUE,
          data: responseDataTosend,
          errorList: [],
          message: [USER_SUCCESSFULLY_SIGNED_IN_0003_1],
        };
      }
    } catch (ex) {
      log.error(
        `Exception occurred in the {userSignin()} refId ,${refId} ex:${ex}`
      );

      return {
        isValid: FALSE,
        data: {},
        errorList: [ex],
        message: [],
      };
    }
  };

  // private getUserDetils(userData:UserReposneFromMiddleWare) {

  // }

  private getUserWishList(userData: UserReposneFromMiddleWare) {
    return userWishListModel.findOne({ email: userData.email });
  }

  private getUserCartDetils(userData: UserReposneFromMiddleWare) {
    return cartUserModel.findOne({ email: userData.email });
  }

  private getAllWishListProductItems(userWishListProduct:Array<String>){
    console.log("in fucntion")
    return productDetailModel.find({ productId: { $in: userWishListProduct } })
  }
}

// module.exports = UserSignIn;
export default UserSignIn;
