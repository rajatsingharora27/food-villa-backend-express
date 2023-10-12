const {AddProductService} =require("../service/index")
const {StatusCodes}=require("http-status-codes")
const { v4: uuidv4 } = require('uuid');

const refid=uuidv4();
class ProductCreationController {

  addProductService = new AddProductService();

  addNewProduct = async (req, res) => {
    try {
      console.log(refid);
      const prductAddedResponse= await this.addProductService.addProduct(req.body);
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
