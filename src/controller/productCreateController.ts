import AddProductService from "../service/AddProductService"
import StatusCodes from "http-status-codes"
const { v4: uuidv4 } = require('uuid');


class ProductCreationController {

  addProductService = new AddProductService();

  addNewProduct = async (req :any, res :any) => {
    const refid=uuidv4();
    try {
      console.log(refid);
      const prductAddedResponse= await this.addProductService.addProduct(req.body,refid);
      console.log(prductAddedResponse)
      return res.status(StatusCodes.OK).json({
        refid:refid,
        message:prductAddedResponse?.message,
        data:{},
        error:prductAddedResponse?.errorList
      })
    } catch (ex) {
      console.log(ex)
    }
  };
}

// module.exports = ProductCreationController;
export default ProductCreationController;