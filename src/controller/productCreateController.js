const {AddProductService} =require("../service/index")
const {StatusCodes}=require("http-status-codes")
const { v4: uuidv4 } = require('uuid');


class ProductCreationController {

  addProductService = new AddProductService();

  addNewProduct = async (req, res) => {
    const refid=uuidv4();
    try {
      console.log(refid);
      const prductAddedResponse= await this.addProductService.addProduct(req.body,refid);
      console.log(prductAddedResponse)
      return res.status(StatusCodes.OK).json({
        refid:refid,
        message:prductAddedResponse.message,
        data:{},
        error:prductAddedResponse.errorList
      })
    } catch (ex) {
      console.log(ex)
    }
  };
}

module.exports = ProductCreationController;
