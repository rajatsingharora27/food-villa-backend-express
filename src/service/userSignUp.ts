import { SIGNUP_USER, TokenInformationType } from "../Types/DataTypes";
import logger from "../config/logger";
import userSignModel from "../model/userSignModel";
import userWishListModel from "../model/userWishListModel";
import cartUserModel from "../model/cartUserModel";
import { v4 as uuidV4 } from "uuid";
import { USER_ROLE } from "../constants/applicationConstants";
import { generateHashPassword, generateJWTtoken } from "../utils/utilMethods";
import { API_RESPONSE, ResponseData } from "../Types/APIResponse";

class UserSignUpService {
  userSignUp = async (req: SIGNUP_USER, refid: string): Promise<API_RESPONSE> => {
    const userId = "UID-" + uuidV4();
    // if flow comes here then it means its a new user

    // check if the user is siging up with the
    // cart items and wish list

    // CREATE USER FIRT in REGISTERD USED TABLE

    try {
      //   this.registreUser(req, userId, refid);
      let errorList: Array<string> = [];
      const isUserWithWishList = req.wishListItems;
      const isUserWithCartList = req.cartItems;
      //   this.addToCartList(isUserWithCartItems, req.emailId)
      const [addUserDB, addWishList, addCartList] = await Promise.all([
        this.registreUser(req, userId, refid, errorList),
        this.addToWishList(isUserWithWishList, userId, req.emailId, refid, errorList),
        this.addToCartList(isUserWithCartList, userId, req.emailId, refid, errorList),
      ]);
      if (addUserDB.isTrue && addWishList.isTrue && addCartList?.isTrue) {
        const tokenObject: TokenInformationType = {
          userName: req.userName,
          emailId: req.emailId,
          phoneNumber: req.phoneNumber,
          password: req.password,
          role: "user",
          userId: userId,
        };
        const token = generateJWTtoken(tokenObject);

        let data: ResponseData = {
          token: token,
          //@ts-ignore
          wishListItem: addWishList.data,
          //@ts-ignore
          cartItems: addCartList.data.cartItem,
        };

        return {
          refId: refid,
          message: errorList,
          data: data,
        };
      }
      return {
        refId: refid,
        message: errorList,
        data: {},
      };
    } catch (ex) {
      logger.error(`excption occurred in {UserSignUpService} refId:${refid} ex:${ex}`);
      return {
        refId: refid,
        message: [`excption occurred in {UserSignUpService} refId:${refid} ex:${ex}`],
        data: {},
      };
    }
  };

  private async addToWishList(isUserWithWishList: String[] | undefined, userId: string, emailId: string, refId: string, errorList: Array<string>) {
    let isTrue: boolean = false;
    try {
      const userWishList = await userWishListModel.findOne({ email: emailId });
      //user is not present already
      let userWishListObject;
      let allWishListUpdateItems;
      if (userWishList == null) {
        userWishListObject = {
          userId: userId,
          email: emailId,
          wishlistItem: isUserWithWishList,
        };
        const wishListAdded = await userWishListModel.create(userWishListObject);

        wishListAdded.save();
        isTrue = true;
        logger.info("product added to wish list table");

        allWishListUpdateItems = userWishListObject.wishlistItem;
      } else {
        let set = new Set();

        //data from sb get alla the product list of wishlist and add to set
        userWishList.wishlistItem.forEach((ele) => {
          set.add(ele.product);
        });

        // passed by user to add in wishlist and add to the set
        if (isUserWithWishList != undefined) {
          isUserWithWishList.forEach((ele) => {
            set.add(ele);
          });
        }

        let arr = Array.from(set);
        // userWishListObject = {
        //   userId: userId,
        //   emailId: emailId,
        //   wishlistItem: arr,
        // };
        const items = await userWishListModel.updateOne({ userId: userId }, { $set: { wishlistItem: arr } });
        isTrue = true;
        logger.info("wish list updated");
        allWishListUpdateItems = arr;
      }
      const wishLitData = allWishListUpdateItems?.map((ele: any) => {
        return ele.product;
      });

      return {
        isTrue,
        data: wishLitData,
        message: errorList,
      };
    } catch (ex) {
      logger.error(`Exception occurred while adding to {addToWishList} refId:${refId}  ex:${ex}`);
      return {
        isTrue: false,
        data: {},
        message: [`Exception occurred in {addToWishList} refId:${refId} , ex: ${ex}`],
      };
    }
  }

  private async addToCartList(isUserWithCartItems: any, userId: string, emailId: string, refid: string, errorList: Array<string>) {
    let isTrue: boolean = false;
    try {
      const userCartList = await cartUserModel.findOne({ email: emailId });
      //user is not present already
      let userCartListObject: Object;
      if (userCartList == null) {
        userCartListObject = {
          userId: userId,
          email: emailId,
          cartItem: isUserWithCartItems,
        };
        const cartListAdded = await cartUserModel.create(userCartListObject);

        cartListAdded.save();
        isTrue = true;
        logger.info("product added to cart list table");
        logger.info(`user Save in db userId:${userId} , email:${emailId} ,refId:${refid}`);
        return {
          isTrue,
          data: userCartListObject,
          message: errorList,
        };
      }
    } catch (ex) {
      logger.error(`Exception occurred in {addToCartList} refId:${refid} , ex: ${ex} `);
      return {
        isTrue: false,
        data: {},
        message: [`Exception occurred in {addToCartList} refId:${refid} , ex: ${ex}`],
      };
    }
  }

  private async registreUser(req: SIGNUP_USER, userId: string, refid: string, errorList: Array<string>) {
    let isTrue: boolean = false;
    try {
      const userObject = {
        userId: userId,
        userName: req.userName,
        email: req.emailId,
        phoneNumber: req.phoneNumber,
        password: generateHashPassword(req.password),
        role: USER_ROLE,
      };
      const userSignUp = await userSignModel.create(userObject);
      userSignUp.save();
      isTrue = true;
      logger.info(`user Save in db userId:${userId} , email:${req.emailId} ,refId:${refid}`);
      return {
        isTrue,
        data: userObject,
        message: errorList,
      };
    } catch (ex) {
      logger.error(`Exception occurred in {registreUser} refId:${refid} , ex: ${ex} `);
      return {
        isTrue: false,
        data: {},
        message: [`Exception occurred in {registreUser} refId:${refid} , ex: ${ex}`],
      };
    }
  }
}

// Can be converted to util function

export default UserSignUpService;
