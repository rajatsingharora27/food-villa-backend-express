import  productDetails from "../model/productDetailModel";
// const {
//   EMPTY_PRODUCT_NAME_0001,
//   PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002,
//   PRICE_CANNOT_BE_EMPTY_0003,
//   INVENTORY_CANNOT_BE_EMPTY_0004,
//   PRODUCT_ALREADY_IN_DATABASE_0005,
//   PRODUCT_ALREADY_IN_DATABASE_0005_1,
// } = require("../constants/errorMessage");
// const { true, false } = require("../constants/applicationConstants");
// const {
//   PRODUCT_SAVED_IN_DATABASE_0001,
//   PRODUCT_SAVED_IN_DATABASE_0001_1,
// } = require("../constants/informationaMessage");
const { v4: uuidv4} = require('uuid');


class AddProductService {

  addProduct = async (productData:any,refId:string) => {
    try {
      let errorList:any = [];
      const [
        isValidName,
        isValidProductDetails,
        isValidaProductPrice,
        isValidInventory,
        isValidProductAlreadyInInventory,
      ] = await Promise.all([
        this.validateName(productData.productName, errorList),
        this.validateProductDetails(productData.productDetails, errorList),
        this.validatePrice(productData.productPrice, errorList),
        this.validInventory(productData.inventory, errorList),
        this.validProductAlreadyInInventory(
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
        const PID=uuidv4();
        const newProduct =await productDetails.create({...productData , productId:`${PID}`});
        newProduct.save()
        return {
          isValid: true,
          errorList: errorList,
          message: [
            // PRODUCT_SAVED_IN_DATABASE_0001 +
            //   productData.productName +
            //   PRODUCT_SAVED_IN_DATABASE_0001_1,

            "product saved"
          ],
        };
      } else {
        return {
          isValid: false,
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

  private validateName(productName:any, errorList:any) {
    if (productName == null) {
      // errorList.push(EMPTY_PRODUCT_NAME_0001);
      errorList.push("empty name")
      return false;
    }
    return true;
  }

  private validateProductDetails(productDetail:any, errorList:any) {
    if (productDetail == null) {
      // errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);
      errorList.push("details empty");
      return false;
    }
    return true;
  }

  private validatePrice(price:any, errorList:any) {
    if (price == null) {
      // errorList.push(PRICE_CANNOT_BE_EMPTY_0003);
      errorList.push("empty price");
      return false;
    }
    return true;
  }

  private validInventory(inventory:any, errorList:any) {
    if (inventory == null) {
      // errorList.push(INVENTORY_CANNOT_BE_EMPTY_0004);
      errorList.push("Inventory empty");
      return false;
    }
    return true;
  }

  private async validProductAlreadyInInventory(productName:any, errorList:any) {
    if (productName == null) {
      // errorList.push(PRODUCT_DETAILS_CANNOT_BE_EMPTY_0002);
      errorList.push("ProductDetails Empty");
      return false;
    } else {
      const isProductAlreadyPresent = await productDetails.findOne({
        productName: productName,
      });

      if (isProductAlreadyPresent !== null) {
        errorList.push(
          // PRODUCT_ALREADY_IN_DATABASE_0005 +
          //   isProductAlreadyPresent.productName +
          //   PRODUCT_ALREADY_IN_DATABASE_0005_1

          "product not added"
        );
        return false;
      } else {
        return true;
      }
    }
  }
}

// module.exports = AddProductService;
export default AddProductService;
