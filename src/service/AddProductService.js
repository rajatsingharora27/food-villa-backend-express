const productDetails = require("../model/productDetailModel");
const {
  EMPTY_PRODUCT_NAME_0001,
  PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002,
  PRICE_CANNOT_BE_EMPTY_0003,
  INVENTORY_CANNOT_BE_EMPTY_0004,
  PRODUCT_ALREADY_IN_DATABASE_0005,
  PRODUCT_ALREADY_IN_DATABASE_0005_1,
} = require("../constants/errorMessage");
const { TRUE, FALSE } = require("../constants/applicationConstants");
const {
  PRODUCT_SAVED_IN_DATABASE_0001,
  PRODUCT_SAVED_IN_DATABASE_0001_1,
} = require("../constants/informationaMessage");

class AddProductService {
  addProduct = async (productData) => {
    try {
      let errorList = [];
      const [
        isValidName,
        isValidProductDetails,
        isValidaProductPrice,
        isValidInventory,
        isValidProductAlreadyInInventory,
      ] = await Promise.all([
        this.#validateName(productData.productName, errorList),
        this.#validateProductDetails(productData.productDetails, errorList),
        this.#validatePrice(productData.productPrice, errorList),
        this.#validInventory(productData.inventory, errorList),
        this.#validProductAlreadyInInventory(
          productData.productName,
          errorList
        ),
      ]);
      if (
        isValidName &&
        isValidInventory &&
        isValidProductDetails &&
        isValidaProductPrice &&
        isValidProductAlreadyInInventory
      ) {
        //SAVE PRODCUT IN DATABSE
   
        const newProduct =await productDetails.create(productData);
        newProduct.save()
        //NOT
        // DEEP COPYING IS NOT HAPPENING WHICLE STORING DATA IN CASE OF PRODUCT DETAILS



        return {
          isValid: TRUE,
          errorList: errorList,
          message: [
            PRODUCT_SAVED_IN_DATABASE_0001 +
              productData.productName +
              PRODUCT_SAVED_IN_DATABASE_0001_1,
          ],
        };
      } else {
        return {
          isValid: FALSE,
          errorList: errorList,
          message:[]
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

  #validateName(productName, errorList) {
    if (productName == null) {
      errorList.push(EMPTY_PRODUCT_NAME_0001);
      return FALSE;
    }
    return TRUE;
  }

  #validateProductDetails(productDetail, errorList) {
    if (productDetail == null) {
      errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);
      return FALSE;
    }
    return TRUE;
  }

  #validatePrice(price, errorList) {
    if (price == null) {
      errorList.push(PRICE_CANNOT_BE_EMPTY_0003);
      return FALSE;
    }
    return TRUE;
  }

  #validInventory(inventory, errorList) {
    if (inventory == null) {
      errorList.push(INVENTORY_CANNOT_BE_EMPTY_0004);
      return FALSE;
    }
    return TRUE;
  }

  async #validProductAlreadyInInventory(productName, errorList) {
    if (productName == null) {
      errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);
      return FALSE;
    } else {
      const isProductAlreadyPresent = await productDetails.findOne({
        productName: productName,
      });

      if (isProductAlreadyPresent !== null) {
        errorList.push(
          PRODUCT_ALREADY_IN_DATABASE_0005 +
            isProductAlreadyPresent.productName +
            PRODUCT_ALREADY_IN_DATABASE_0005_1
        );
        return FALSE;
      } else {
        return TRUE;
      }
    }
  }
}

module.exports = AddProductService;
