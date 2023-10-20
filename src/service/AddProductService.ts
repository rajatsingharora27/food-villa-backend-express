import productDetails from "../model/productDetailModel";

import { TRUE, FALSE } from "../constants/applicationConstants";
import { PRODUCT_SAVED_IN_DATABASE_0001, PRODUCT_SAVED_IN_DATABASE_0001_1 } from "../constants/informationaMessage";

import { EMPTY_PRODUCT_NAME_0001, PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002, PRICE_CANNOT_BE_EMPTY_0003, INVENTORY_CANNOT_BE_EMPTY_0004, PRODUCT_ALREADY_IN_DATABASE_0005, PRODUCT_ALREADY_IN_DATABASE_0005_1 } from "../constants/errorMessage";

import { v4 as uuidv4 } from "uuid";
import { ProductType } from "../Types/ProductType";
import log from "../config/logger";

class AddProductService {
  addProduct = async (productData: ProductType, refId: string) => {
    try {
      log.info(`addProduct() started refId:${refId}`);
      let errorList: Array<string> = [];
      const [isValidName, isValidProductDetails, isValidaProductPrice, isValidInventory, isValidProductAlreadyInInventory] = await Promise.all([
        this.validateName(productData.productName, errorList),
        this.validateProductDetails(productData.productDetails, errorList),
        this.validatePrice(productData.productPrice, errorList),
        this.validInventory(productData.inventory, errorList),
        this.validProductAlreadyInInventory(productData.productName, errorList),
      ]);
      if (isValidName && isValidInventory && isValidProductDetails && isValidaProductPrice && isValidProductAlreadyInInventory) {
        //SAVE PRODCUT IN DATABSE
        const PID = uuidv4();
        const newProduct = await productDetails.create({ ...productData, productId: `${PID}` });
        newProduct.save();
        return {
          isValid: TRUE,
          errorList: errorList,
          message: [PRODUCT_SAVED_IN_DATABASE_0001 + productData.productName + PRODUCT_SAVED_IN_DATABASE_0001_1],
        };
      } else {
        return {
          isValid: FALSE,
          errorList: errorList,
          message: [],
        };
      }
    } catch (ex) {
      console.log(ex);
    }

    // check if the procuct already exist in the database? ->on product name

    //save in database if passed

    //will return {message , error , if valida then some product details}
    // console.log(errorList);

    // console.log(details.productName);
  };

  private validateName(productName: any, errorList: any) {
    if (productName == null) {
      errorList.push(EMPTY_PRODUCT_NAME_0001);

      return FALSE;
    }
    return TRUE;
  }

  private validateProductDetails(productDetail: any, errorList: any) {
    if (productDetail == null) {
      errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);

      return FALSE;
    }
    return TRUE;
  }

  private validatePrice(price: any, errorList: any) {
    if (price == null) {
      errorList.push(PRICE_CANNOT_BE_EMPTY_0003);

      return FALSE;
    }
    return TRUE;
  }

  private validInventory(inventory: any, errorList: any) {
    if (inventory == null) {
      errorList.push(INVENTORY_CANNOT_BE_EMPTY_0004);

      return FALSE;
    }
    return TRUE;
  }

  private async validProductAlreadyInInventory(productName: any, errorList: any) {
    if (productName == null) {
      errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);

      return FALSE;
    } else {
      const isProductAlreadyPresent = await productDetails.findOne({
        productName: productName,
      });

      if (isProductAlreadyPresent !== null) {
        errorList.push(PRODUCT_ALREADY_IN_DATABASE_0005 + isProductAlreadyPresent.productName + PRODUCT_ALREADY_IN_DATABASE_0005_1);
        return FALSE;
      } else {
        return TRUE;
      }
    }
  }
}

// module.exports = AddProductService;
export default AddProductService;
