import { FALSE, TRUE } from "../constants/applicationConstants";
import {
  EMPTY_PRODUCT_NAME_0001,
  INVENTORY_CANNOT_BE_EMPTY_0004,
  PRICE_CANNOT_BE_EMPTY_0003,
  PRODUCT_ALREADY_IN_DATABASE_0005,
  PRODUCT_ALREADY_IN_DATABASE_0005_1,
  PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002,
  STORAGE_DETAILS_ISNULL_0016,
} from "../constants/errorMessage";
import productDetailModel from "../model/productDetailModel";
import { v2 as cloudinary } from "cloudinary";
import logger from "../config/logger";

export const validateName = (productName: any, errorList: any) => {
  if (productName == null) {
    errorList.push(EMPTY_PRODUCT_NAME_0001);

    return FALSE;
  }
  return TRUE;
};

// export const validateProductDetails = (productDetail: any, errorList: any) => {
//   if (productDetail == null) {
//     errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);

//     return FALSE;
//   }
//   return TRUE;
// };

export const validateStorageAndConsumptionProductDetails = (storageDetails: any, errorList: any) => {
  if (storageDetails == null) {
    errorList.push(STORAGE_DETAILS_ISNULL_0016);
    return FALSE;
  }
  return TRUE;
};

export const validatePrice = (price: any, errorList: any) => {
  if (price == null) {
    errorList.push(PRICE_CANNOT_BE_EMPTY_0003);

    return FALSE;
  }
  return TRUE;
};

export const validInventory = (inventory: any, errorList: any) => {
  if (inventory == null) {
    errorList.push(INVENTORY_CANNOT_BE_EMPTY_0004);

    return FALSE;
  }
  return TRUE;
};

export const validProductAlreadyInInventory = async (productName: any, errorList: any) => {
  if (productName == null) {
    errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);

    return FALSE;
  } else {
    const isProductAlreadyPresent = await productDetailModel.findOne({
      productName: productName,
    });

    if (isProductAlreadyPresent !== null) {
      errorList.push(PRODUCT_ALREADY_IN_DATABASE_0005 + isProductAlreadyPresent.productName + PRODUCT_ALREADY_IN_DATABASE_0005_1);
      return FALSE;
    } else {
      return TRUE;
    }
  }
};

export const validateProductImageAddedToCloudinary = async (productData: any, files: any) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLODUINARY_NAME,
      api_key: process.env.CLODUINARY_API_KEY,
      api_secret: process.env.CLODUINARY_API_SECRET,
    });
    const options = {
      public_id: files.file["name"],
      folder: productData.productCategory,
    };
    const result = await cloudinary.uploader.upload(files.file["path"], options);
    if (result != undefined || result !== null) {
      return {
        isValid: TRUE,
        publicID: result.public_id,
        secureUrl: result.secure_url,
        url: result.url,
      };
    } else {
      return {
        isValid: FALSE,
        publicID: "",
        secureUrl: "",
        url: "",
      };
    }
  } catch (ex) {
    logger.error(`Exception occurred while storing image to cloudinary ex:${ex}`);
    return {
      isValid: FALSE,
      publicID: "",
      secureUrl: "",
      url: "",
    };
  }
};
