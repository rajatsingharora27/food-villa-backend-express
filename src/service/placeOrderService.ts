import mongoose from "mongoose";
import productDetailModel from "../model/productDetailModel";
import { FALSE, TRUE } from "../constants/applicationConstants";
import axios from "axios";
import { getRazorPayInstance } from "../config/razorPayConfig";
import { v4 as uuidV4 } from "uuid";
import cartUserModel from "../model/cartUserModel";
import { MAKEORDER_REQUEST, ORDER_CART } from "../Types/DataTypes";
import logger from "../config/logger";
import userOrderModelRepo from "../model/userOrderModel";

class PlaceOrderService {
  makeOrderIDAndUpdateInventory = async (cartItemsToOrder: MAKEORDER_REQUEST, refId: string) => {
    const session = await mongoose.startSession();
    console.log("Call from ui");
    session.startTransaction();
    let errorList: string[] = [];
    let productNotAvaiable = [];
    let updatedCart = [];
    try {
      let areProductInInventory = true;

      for (const ele of cartItemsToOrder.cartItem) {
        const product = await productDetailModel.findOne({ productId: ele.productId });
        const { quantity } = ele;

        if (product) {
          if (product.inventory < quantity) {
            errorList.push(`${product.productName} only ${product.inventory} items are avaiable`);
            productNotAvaiable.push({ productName: product.productName, quantity: quantity, productId: product.productId });
            areProductInInventory = false;
          } else {
            let newQuant = product.inventory - quantity;
            // await productDetailModel.findOneAndUpdate({ productId: ele.productId }, { $set: { inventory: newQuant } });
            await productDetailModel.findOneAndUpdate({ productId: ele.productId }, { $set: { inventory: newQuant } }).session(session);
            updatedCart.push(product);
            // totalProductPrice += product.productPrice * quantity;
          }
        }
      }
      const razorPayInstance = getRazorPayInstance();

      const orderInitaiateDetails = await razorPayInstance?.orders.create({ amount: cartItemsToOrder.userInformation.totalCost, currency: "INR", receipt: "OID" + uuidV4() });

      if (areProductInInventory) {
        await session.commitTransaction();
        session.endSession();

        return {
          isTrue: TRUE,
          message: ["Inventory Updated"],
          data: { orderInitaiateDetails },
        };
      } else {
        throw new Error("Product need to be rolled back because inventory is less than placed order");
      }
    } catch (ex) {
      session && (await session.abortTransaction());
      session && session.endSession();
      return {
        isValid: false,
        //@ts-ignore
        message: [ex.message],
        data: { updatedCart: updatedCart, productNotAvaiable },
      };
    }
  };

  checkPaymentFail = async (paymentStatusBody: MAKEORDER_REQUEST) => {
    try {
      paymentStatusBody.cartItem.forEach(async (product: ORDER_CART) => {
        const updatedData = await productDetailModel.findOneAndUpdate({ productId: product.productId }, { $inc: { inventory: product.quantity } });
        console.log(updatedData, "Data Updated");
      });
    } catch (ex) {
      logger.error(`Exception occurred while updating the product table: ex:${ex}`);
    }
  };

  checkPaymentSuccess = async (paymentStatusBody: MAKEORDER_REQUEST) => {
    // Make the order table

    try {
      let orderCartItems = paymentStatusBody.cartItem.map((item: ORDER_CART) => {
        return {
          productName: item.productName,
          productId: item.productId,
          productPrice: item.productPrice,
          quantity: item.quantity,
        };
      });
      console.log(orderCartItems, "Order");
      const userOrderObject = {
        orderId: "OID-" + uuidV4(),
        razorPayId: paymentStatusBody.userInformation.razorPayId,
        userName: paymentStatusBody.userInformation.userName,
        userAddress: paymentStatusBody.userInformation.address,
        userPhoneNumber: paymentStatusBody.userInformation.phoneNumber,
        userPin: paymentStatusBody.userInformation.pin,
        userOrder: orderCartItems,
      };
      const orderSaveDetails = await userOrderModelRepo.create(userOrderObject);
      orderSaveDetails.save();
    } catch (ex) {
      logger.error(`Excprtion occurred while saving order Details ex:${ex}`);
    }
  };
}

export default PlaceOrderService;
