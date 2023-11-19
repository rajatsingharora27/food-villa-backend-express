import jwt, { JwtPayload } from "jsonwebtoken";
import { DECODE_TOKEN, PRODUCT_ON_FILTER, TokenInformationType, UserInputRequest } from "../Types/DataTypes";
import bcrypt from "bcrypt";
import logger from "../config/logger";
import { API_RESPONSE, VALIDATION_RESPONSE } from "../Types/APIResponse";
import {
  EMAIL_ID_REQUIRES_0013,
  MINIMUM_USERNAME_LENGTH_0012,
  USER_ALREADY_EXIST_0007_1,
  USER_ALREADY_EXIST_0007_2,
  USER_NAME_IS_NESSARY_0008,
  USER_PASSWORD_IS_NESSARY_0009,
} from "../constants/errorMessage";
import userSignModel from "../model/userSignModel";
import { CART_ITEM_TYPE, SIGNUP_USER, VALIDATION_RETURN_VALUE } from "../Types/DataTypes";
import userWishListModel from "../model/userWishListModel";
import cartUserModel from "../model/cartUserModel";
import productDetailModel from "../model/productDetailModel";

export const generateJWTtoken = (userObject: TokenInformationType) => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== undefined) {
    return jwt.sign(
      {
        // data: {
        userName: userObject.userName,
        userId: userObject.userId,
        email: userObject.emailId,
        role: userObject.role,
        // },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
  }
};

export const generateHashPassword = (passoword: string) => {
  const saltRounds = process.env.SALT_ROUNDS;

  let hash: string = "";
  try {
    if (saltRounds != null && saltRounds != undefined) {
      hash = bcrypt.hashSync(passoword, parseInt(saltRounds));
    }
  } catch (ex) {
    logger.error(`Exception occurred {generateHashPassword()} ${ex}`);
  }

  return hash;
};

export const verifyToken = (token: string, api: string): VALIDATION_RESPONSE => {
  let tokenDecodeValue;
  if (process.env.JWT_SECRET != undefined || process.env.JWT_SECRET != null) {
    tokenDecodeValue = jwt.verify(token, process.env.JWT_SECRET) as DECODE_TOKEN;
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenDecodeValue.exp != undefined && tokenDecodeValue.exp < currentTime) {
      return {
        isValid: false,
        message: ["Token is expired please sign in again"],
        data: {},
      };
    } else if (tokenDecodeValue.role != "admin" && (api == "/delete-user" || api == "/add-product" || api == "/delete-product" || api == "/filter-products-admin")) {
      return {
        isValid: false,
        message: ["Admin is allowed to delete the user"],
        data: {},
      };
    }

    return {
      isValid: true,
      message: ["user is validated"],
      data: tokenDecodeValue,
    };
  } else {
    return { isValid: false, message: ["Some error occurred"], data: {} };
  }
};

export const verifiedName = (userName: string, errorList: Array<string>): VALIDATION_RETURN_VALUE => {
  let isValidValue: boolean = false;
  if (userName == null) {
    errorList.push(USER_NAME_IS_NESSARY_0008);
  } else if (userName.trim().length < 2) {
    errorList.push(MINIMUM_USERNAME_LENGTH_0012);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
};

export const verifiedEmail = (emailId: string, errorList: string[]): VALIDATION_RETURN_VALUE => {
  let isValidValue: boolean = false;
  if (emailId == null) {
    errorList.push(EMAIL_ID_REQUIRES_0013);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
};

export const verifyRegistedUser = async (emailId: string, errorList: string[]): Promise<VALIDATION_RETURN_VALUE> => {
  const userFromDB = await userSignModel.findOne({ email: emailId });

  let isValidValue: boolean = false;
  if (userFromDB != null) {
    errorList.push(USER_ALREADY_EXIST_0007_1 + emailId + USER_ALREADY_EXIST_0007_2);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList, data: userFromDB };
};

export const verifyPassword = (password: string, errorList: string[]): VALIDATION_RETURN_VALUE => {
  let isValidValue: boolean = false;
  if (password == null) {
    errorList.push(USER_PASSWORD_IS_NESSARY_0009);
  } else if (password.trim().length == 0) {
    errorList.push(USER_PASSWORD_IS_NESSARY_0009);
  } else {
    isValidValue = true;
  }
  return { isValid: isValidValue, error: errorList };
};

export const verifySignInPassword = (password: string, encrypted: string): boolean => {
  if (bcrypt.compareSync(password, encrypted)) {
    return true;
  }
  return false;
};

export const addToWishList = async (isUserWithWishList: string[] | undefined, userId: string, emailId: string, refId: string, errorList: Array<string>) => {
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
      let finalWishListArray = arr.map((ele) => {
        return { product: ele };
      });
      const items = await userWishListModel.updateOne({ userId: userId }, { $set: { wishlistItem: finalWishListArray } });
      isTrue = true;
      logger.info("wish list updated");
      allWishListUpdateItems = finalWishListArray;
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
};

export const getCartListItem = async (userDocumentFromDb: UserInputRequest, inputRequest: SIGNUP_USER) => {
  // here in this function because while siging in user already has something in cart
  const userCartDetailsDocument = await cartUserModel.findOne({ userId: userDocumentFromDb.userId });
  console.log(userCartDetailsDocument);
  let listOfProdcutId: any = [];

  if (userCartDetailsDocument != null) {
    userCartDetailsDocument.cartItem.forEach((ele: any) => {
      listOfProdcutId.push(ele.productId);
    });
  }
  if (inputRequest.cartItems != null) {
    inputRequest.cartItems.forEach((ele: any) => {
      listOfProdcutId.push(ele.productId);
    });
  }

  const productCompleteInfo = await productDetailModel.find({ productId: { $in: listOfProdcutId } });
  console.log(productCompleteInfo);

  // Make object of cart item already stored items +new one

  let resultCartArray = [];
  let parentMap = new Map();
  productCompleteInfo.forEach((items) => {
    let obj = {
      productId: items.productId,
      price: items.productPrice,
      image: items.productImageUrl[0],
    };
    parentMap.set(items.productId, items);
    resultCartArray.push(obj);
  });

  if (inputRequest.cartItems != null && inputRequest.cartItems.length != 0) {
    //means i am passing somethin in cart from ui before loggin in
    if (userCartDetailsDocument) {
      // user has alsedy something in cart db

      let currentCartItems = userCartDetailsDocument.cartItem;
      let map = new Map();
      currentCartItems.forEach((ele) => {
        map.set(ele.productId, ele);
      });

      inputRequest.cartItems?.forEach((ele) => {
        let productId = ele.productId;
        let toIncrease = ele.increase;
        if (map.has(productId) && toIncrease == true) {
          // if user already has same product in cart and adde same while siging in
          // if user has the same product and wants to increse its value
          let updatedCartItem = {
            productId: productId,
            isPurchased: false,
            quantity: ele.quantity + map.get(productId).quantity,
          };
          map.set(productId, updatedCartItem);
        } else if (map.has(productId) && toIncrease == false && ele.quantity != undefined) {
          // if user has the same product and wants to decrese its value
          // if (ele.quantity - map.get(productId).quantity < 0) {
          // }

          let updatedCartItem = {
            productId: productId,
            isPurchased: false,
            quantity: map.get(productId).quantity - ele.quantity > 0 ? map.get(productId).quantity - ele.quantity : 0,
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
      let newArr: any = [];
      arr.forEach((ele) => {
        console.log("ele==>>", ele);
        let id = ele.productId;
        let dataWithImageAndPriceInfo = parentMap.get(id);
        let obj = {
          productId: id,
          image: dataWithImageAndPriceInfo.productImageUrl[0],
          price: dataWithImageAndPriceInfo.productPrice,
          name: ele.name,
          quantity: ele.quantity,
        };
        newArr.push(obj);
      });
      console.log(arr);
      return {
        isValid: true,
        message: ["Cart updated"],
        data: newArr,
      };
    } else {
      //mean user has passesd someting from UI and user is not stored in db so creting new user with the
      // cart items passed by user

      let cartList: any = [];
      inputRequest.cartItems.forEach((ele) => {
        if (parentMap.has(ele.productId)) {
          let obj = {
            productId: ele.productId,
            image: parentMap.get(ele.productId).productImageUrl[0],
            price: parentMap.get(ele.quantity).productPrice,
            // name: ele.name,
            quantity: ele.quantity,
          };
          cartList.push(obj);
        }
      });

      const newCartItem = {
        userId: userDocumentFromDb.userId,
        email: userDocumentFromDb.email,
        cartItem: cartList,
      };
      const newCartItemToBeAddedInCartTable = await cartUserModel.create(newCartItem);
      newCartItemToBeAddedInCartTable.save();
      return {
        isValid: true,
        message: ["WishList updated"],
        data: inputRequest.cartItems,
      };
    }
  } else {
    let cartList: any = [];
    if (userCartDetailsDocument != null) {
      userCartDetailsDocument.cartItem.forEach((ele: any) => {
        if (parentMap.has(ele.productId)) {
          let obj = {
            name: ele.name,
            productId: ele.productId,
            price: parentMap.get(ele.productId).productPrice,
            quantity: ele.quantity,
            image: parentMap.get(ele.productId).productImageUrl[0],
          };
          cartList.push(obj);
        }
      });
      return {
        isValid: true,
        message: ["Data From DB"],
        data: cartList,
      };
    }
    return {
      isValid: false,
      message: ["No data to be added in cart"],
      data: userCartDetailsDocument,
    };
  }
};

export const buildQuery = (filterReq: PRODUCT_ON_FILTER, refId: string, isAdminAccess: boolean) => {
  let query = {};

  if (isAdminAccess == false) {
    query = queryWithoutAdminAccess(query, filterReq);
  } else {
    query = queryWithoutAdminAccess(query, filterReq);
    query = queryWithAdminAccess(query, filterReq);
  }
  return query;
};

function queryWithoutAdminAccess(query: {}, filterReq: PRODUCT_ON_FILTER) {
  if (filterReq.productName !== null && filterReq.productName.trim().length > 0) {
    query = { ...query, productName: filterReq.productName };
  }
  if (filterReq.minPrice != null && filterReq.minPrice != undefined && filterReq.minPrice !== 0) {
    query = { ...query, productPrice: { $gte: filterReq.minPrice } };
  }
  if (filterReq.maxPrice != null && filterReq.maxPrice != undefined && filterReq.maxPrice !== 0) {
    query = { ...query, productPrice: { $lte: filterReq.maxPrice } };
  }
  if (filterReq.category != null && filterReq.category.trim().length > 0) {
    query = { ...query, productCategory: filterReq.category };
  }
  if (filterReq.festiveTag != null && filterReq.festiveTag.trim().length > 0) {
    query = { ...query, festiveTag: filterReq.festiveTag };
  }

  return query;
}

function queryWithAdminAccess(query: {}, filterReq: PRODUCT_ON_FILTER) {
  if (filterReq.minInventory != null && filterReq.minInventory != undefined && filterReq.minInventory != 0) {
    query = { ...query, inventory: { $gte: filterReq.minInventory } };
  }
  if (filterReq.maxInventory != null && filterReq.maxInventory != undefined && filterReq.maxInventory != 0) {
    query = { ...query, inventory: { $lte: filterReq.maxInventory } };
  }
  if (filterReq.inStock != null && filterReq.inStock != undefined) {
    query = { ...query, inStock: filterReq.inStock };
  }
  return query;
}
