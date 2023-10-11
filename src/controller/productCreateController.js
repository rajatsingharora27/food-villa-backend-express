const {AddProductService} =require("../service/index")
const {StatusCodes}=require("http-status-codes")
const {v4}=require("uuid")

const refid=v4;
class ProductCreationController {

  addProductService = new AddProductService();

  addNewProduct = async (req, res) => {
    try {
      console.log(req.body);
      const prductAddedResponse= await this.addProductService.addProduct(req.body);
      res.status(StatusCodes.OK).json({
        refid:refid,
        message:{},
        data,
        error:{}
      })
    } catch (ex) {}
  };
}

module.exports = ProductCreationController;
