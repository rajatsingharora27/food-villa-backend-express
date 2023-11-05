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
}

export default ProductRetrivecontroller;
