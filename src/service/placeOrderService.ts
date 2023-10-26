import mongoose from "mongoose";
import productDetailModel from "../model/productDetailModel";
import { TRUE } from "../constants/applicationConstants";

class PlaceOrderService {
  userOrderReview = (cartItemsToOrder: any, refId: string) => {
    // check here cost
    // which products are available
  };

  placeUserOrder = async (cartItemsToOrder: any, refId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let errorList: string[] = [];
      let areProductInInventory = true;
      let totalProductPrice: number = 0;

      cartItemsToOrder.cartItem.map(async (ele: any) => {
        let product = await productDetailModel.findOne({ productId: ele.productId });
        const { quantity } = ele;
        try {
          if (product) {
            if (product.inventory < quantity) {
              throw new Error("Product need to be rolled back becase inventory is less than placed order");
            } else {
              let newQuant = product.inventory - quantity;
              await productDetailModel.findOneAndUpdate({ productId: ele.productId }, { $set: { inventory: newQuant } });
            }
          }
        } catch (err) {
          session && (await session.abortTransaction());
          session && session.endSession();
          return {
            isValid: false,
            message: [err],
            data: {},
          };
        }
      });

      await session.commitTransaction();
      session.endSession();
      return {
        isTrue: TRUE,
        message: ["Inventory Updated"],
        data: {},
      };
    } catch (ex) {
      session && (await session.abortTransaction());
      session && session.endSession();
      return {
        isValid: false,
        message: [ex],
        data: {},
      };
    }

    // console.log(cartItemsToOrder.cartItem);
    // const orderPromises = cartItemsToOrder.cartItem.map(async (cartItem: any) => {
    //   const { productId, quantity } = cartItem;

    //   // Check if the product is in stock
    //   const product = await productDetailModel.findOne({ productId: productId }).session(session);
    //   //   console.log(product);
    //   if (!product || product.inventory < quantity) {
    //     errorList.push(productId);
    //     areProductInInventory = false;
    //   } else {
    //     console.log(product.productName, product.inventory);
    //     let newQuant = product.inventory - quantity;
    //     await productDetailModel.findByIdAndUpdate({ productId: productId }, { $set: { inventory: newQuant } });
    //     totalProductPrice += product.productPrice * quantity;
    //   }
    //   console.log(totalProductPrice);
    //   if (!areProductInInventory) {
    //     session.abortTransaction();
    //   }
    // });
  };
}

export default PlaceOrderService;
