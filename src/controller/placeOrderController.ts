import { Request, Response } from "express";
import PlaceOrderService from "../service/placeOrderService";
import { StatusCodes } from "http-status-codes";

class PlaceOrderController {
  private placeOrderService = new PlaceOrderService();
  placeOrderUserController = async (req: Request, res: Response) => {
    // console.log(req.body);
    const placeOrder = await this.placeOrderService.generatePaymentLink(req.body, "12345");
    if (placeOrder.isTrue) {
      res.status(StatusCodes.OK).json({
        refId: "1234",
        message: placeOrder.message,
        data: placeOrder.data,
      });
    } else {
      res.status(StatusCodes.EXPECTATION_FAILED).json({
        refId: "1234",
        message: placeOrder.message,
        data: placeOrder.data,
      });
    }
  };
}

export default PlaceOrderController;
