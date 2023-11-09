import { Request, Response } from "express";
import GetProductService from "../service/getProductService";
import { StatusCodes } from "http-status-codes";

class ProductRetrivecontroller {
  getProductService = new GetProductService();

  getProductcontroller = async (req: Request, res: Response) => {
    console.log(req.query);
    //@ts-ignore
    const data = await this.getProductService.getTheRequstedProducts(req.query);
    res.status(StatusCodes.OK).json({
      refId: "123",
      errorMessage: data.errorMessage,
      data: data.data,
    });
  };

  getRandon8Products = async (req: Request, res: Response) => {
    const data = await this.getProductService.getRandom8ProductForMainPage();
    res.status(StatusCodes.OK).json({
      refId: "123",
      errorMessage: data.errorMessage,
      data: data.data,
    });
  };

  //   getMainProductOfCompanyDetails = async (req: Request, res: Response) => {

  //     const data =await

  //   }
}

export default ProductRetrivecontroller;
