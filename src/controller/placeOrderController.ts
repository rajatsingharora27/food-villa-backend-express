import { Request, Response } from "express";
import PlaceOrderService from "../service/placeOrderService";
import { StatusCodes } from "http-status-codes";

class PlaceOrderController {
  private placeOrderService = new PlaceOrderService();
  placeOrderUserController = async (req: Request, res: Response) => {
    // console.log(req.body);
    const placeOrder = await this.placeOrderService.makePaymentAndUpdateInventory(req.body, "12345");
    if (placeOrder.isTrue) {
      res.status(StatusCodes.OK).json({
        refId: "1234",
        isValid: true,
        message: placeOrder.message,
        data: placeOrder.data,
      });
    } else {
      res.status(StatusCodes.EXPECTATION_FAILED).json({
        refId: "1234",
        isValid: false,
        message: placeOrder.message,
        data: placeOrder.data,
      });
    }
  };

  paymentStatusController = async (req: Request, res: Response) => {
    const placeOrder = await this.placeOrderService.checkPaymentSuccess(req.body);
  };
}

export default PlaceOrderController;
