import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import AddProductService from "../service/addProductService";
import logger from "../config/logger";
import { v4 as uuidV4 } from "uuid";
import { FALSE } from "../constants/applicationConstants";

class AddProductController {
  private productRelatedService = new AddProductService();

  addNewProduct = async (req: Request, res: Response) => {
    const refid = res.locals.refid;
    try {
      console.log(refid);
      const prductAddedResponse = await this.productRelatedService.addProduct(req.fields, req.files, refid);
      console.log(prductAddedResponse);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: prductAddedResponse?.message,
        data: prductAddedResponse.data,
      });
    } catch (ex) {
      console.log(ex);
      logger.error(`Exception in addProductService when addingProduct refId:${refid} , ex: ${ex}`);
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const refid = res.locals.refid;
    try {
      console.log(refid);
      if (req.query.productId === undefined) {
        return res.status(StatusCodes.EXPECTATION_FAILED).json({
          refid: refid,
          message: ["productId is required"],
          data: {},
        });
      }
      if (typeof req.query.productId === "string") {
        const prductDeletedResponse = await this.productRelatedService.deleteProductFromDB(req.query.productId, refid);
        return res.status(StatusCodes.OK).json({
          refid: refid,
          message: prductDeletedResponse?.message,
          data: prductDeletedResponse.data,
        });
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        refid: refid,
        message: [`Error occurred while deleteing the product ${req.query.productId} ,refid: ${refid}`],
        data: {},
      });
    } catch (ex) {
      console.log(ex);
      logger.error(`Exception occurred while deleteing the product ${req.query.productId} ,refid: ${refid}`);
    }
  };

  filterProduct = async (req: Request, res: Response) => {
    const refid = uuidV4();
    try {
      console.log(refid);

      const prductFilterResponse = await this.productRelatedService.getProductOnFilterQuery(req.body, refid, FALSE);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: prductFilterResponse?.message,
        data: prductFilterResponse.data,
      });
    } catch (ex) {
      console.log(ex);
      logger.error(`Exception occurred while Retiving product the product ${req.query.productId} ,refid: ${refid}`);
    }
  };

  filterProductAdmin = async (req: Request, res: Response) => {
    let refid;
    if (res.locals.isAdminAccess === true) {
      refid = res.locals.refid;
    }
    refid = uuidV4();
    try {
      console.log(refid);

      const prductFilterResponse = await this.productRelatedService.getProductOnFilterQuery(req.body, refid, res.locals.isAdminAccess);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: prductFilterResponse?.message,
        data: prductFilterResponse.data,
      });
    } catch (ex) {
      console.log(ex);
      logger.error(`Exception occurred while Retiving product the product ${req.query.productId} ,refid: ${refid}`);
    }
  };

  getProduct = async (req: Request, res: Response) => {
    const refid = uuidV4();
    const pro = req.query.product;
    if (pro == undefined) return;
    //@ts-ignore
    const productInfo = await this.productRelatedService.getProductFormId(pro);
    return res.status(StatusCodes.OK).json({
      refid: refid,
      message: productInfo?.message,
      data: productInfo.data,
    });
  };
}

export default AddProductController;
