const productDetails = require("../model/productDetailModel");

class AddProductService {
  addProduct = async (productData) => {
    // if not validate product details passed in the request-> async call all
    // const isValidName =this.#validateName(productData.productName);
    // const isValidProductDetails=this.#validateProductDetails(productData.productDetails);
    let errorList=[]
    console.log("hello")
    const [isValidName,isValidProductDetails]=await Promise.all([
      this.#validateName(productData.productName,errorList),
      
      this.#validateProductDetails(productData.productDetails,errorList),
    ]);

    // check if the procuct already exist in the database? ->on product name



    //save in database if passed

    //will return {message , error , if valida then some product details}
    console.log(errorList)
    const details = await productDetails.findOne({
      productName: productData.productName,
    });
    console.log(details.productName);
  };

  #validateName(data,errorList) {
    errorList.push("error 1")
    return true;}

  #validateProductDetails(data,errorList) {
    errorList.push("error 2")
    return false;}
}

module.exports = AddProductService;
