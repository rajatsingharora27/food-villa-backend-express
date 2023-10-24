import productDetails from "../model/productDetailModel";

import { TRUE, FALSE } from "../constants/applicationConstants";
import { PRODUCT_SAVED_IN_DATABASE_0001, PRODUCT_SAVED_IN_DATABASE_0001_1 } from "../constants/informationaMessage";

import { v4 as uuidv4 } from "uuid";

import log from "../config/logger";
import { validInventory, validProductAlreadyInInventory, validateName, validatePrice, validateProductDetails } from "../validation/validation";
import logger from "../config/logger";
import productDetailModel from "../model/productDetailModel";
import { PRODUCT_ON_FILTER } from "../Types/DataTypes";
import { buildQuery } from "../utils/utilMethods";

class AddProductService {
  addProduct = async (productData: any, refId: string) => {
    try {
      log.info(`addProduct() started refId:${refId}`);
      let errorList: Array<string> = [];
      const [isValidName, isValidProductDetails, isValidaProductPrice, isValidInventory, isValidProductAlreadyInInventory] = await Promise.all([
        validateName(productData.productName, errorList),
        validateProductDetails(productData.productDetails, errorList),
        validatePrice(productData.productPrice, errorList),
        validInventory(productData.inventory, errorList),
        validProductAlreadyInInventory(productData.productName, errorList),
      ]);
      if (isValidName && isValidInventory && isValidProductDetails && isValidaProductPrice && isValidProductAlreadyInInventory) {
        //SAVE PRODCUT IN DATABSE
        const PID = uuidv4();
        const newProduct = await productDetails.create({ ...productData, productId: `${PID}` });
        newProduct.save();
        return {
          isValid: TRUE,
          message: [PRODUCT_SAVED_IN_DATABASE_0001 + productData.productName + PRODUCT_SAVED_IN_DATABASE_0001_1],
          data: {},
        };
      } else {
        return {
          isValid: FALSE,
          message: errorList,
          data: {},
        };
      }
    } catch (ex) {
      console.log(`Exception occurred while creating product from database refId:${refId} ,ex:${ex}`);
      return {
        isValid: FALSE,
        errorList: [`Exception occurred while creating product from database refId:${refId} ,ex:${ex}`],
        message: {},
      };
    }
  };

  deleteProductFromDB = async (productId: string, refId: string) => {
    logger.info(`Delete Product from DB: ${productId} {deleteProductFromDB} started refId:${refId}`);
    const productDelete = await productDetailModel.findOneAndDelete({ productId: productId });
    console.log(productDelete);
    if (productDelete == null) {
      return {
        isValid: FALSE,
        message: [`Product ${productId} not found in the database`],
        data: {},
      };
    }
    logger.info(`Delete Product from DB: ${productId} {deleteProductFromDB} ended refId:${refId}`);
    return {
      refId,
      message: [`Delete Product from DB: ${productId} {deleteProductFromDB} ended refId:${refId}`],
      data: productDelete,
    };
  };

  getProductOnFilterQuery = async (filterReq: PRODUCT_ON_FILTER, refId: string, isAdminAccess: boolean) => {
    logger.info(`getProductOnFilterQuery() started refId:${refId}`);

    const query = buildQuery(filterReq, refId, isAdminAccess);
    const page = filterReq.page; // The page number you want to retrieve
    const itemsPerPage = filterReq.totalItemPerPage; // The number of items to display per page

    // Calculate the number of documents to skip based on the page and itemsPerPage
    const skip = (page - 1) * itemsPerPage;

    // Query the database with pagination using skip and limit
    const products = await productDetailModel
      .find(query)
      .skip(skip) // Skip documents
      .limit(itemsPerPage); // Limit the number of documents to retrieve

    return {
      isValid: true,
      message: ["Product Retrieved"],
      data: products,
    };
  };
}

export default AddProductService;
