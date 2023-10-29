import mongoose from "mongoose";
import productDetailModel from "../model/productDetailModel";
import { FALSE, TRUE } from "../constants/applicationConstants";
import axios from "axios";
import { constgetRazorPayInstance } from "../config/razorPayConfig";
import { v4 as uuidV4 } from "uuid";
import Stripe from "stripe";

// import Stripe from "stripe";

class PlaceOrderService {
  paymentStatusFromUI = {};

  // ... (other methods and imports)

  //   generatePaymentLink = async (cartItemsToOrder: any, refId: string) => {
  //     try {
  //       // Generate Razor Pay payment Link
  //       const razorPayInstance = constgetRazorPayInstance();
  //       let paymentLinkObject = {
  //         amount: cartItemsToOrder.userInformation.totalCost * 100,
  //         currency: "INR",
  //         customer: {
  //           name: cartItemsToOrder.userInformation.userName,
  //           email: cartItemsToOrder.userInformation.emailId,
  //           contact: cartItemsToOrder.userInformation.contactNumber,
  //           address: cartItemsToOrder.userInformation.address,
  //           deliverySlot: cartItemsToOrder.userInformation.delevirySlot,
  //         },
  //         notify: {
  //           sms: true,
  //           email: true,
  //         },
  //         callback_url: "https://example-callback-url.com/", // --> need add UI url to which i want to redirect on success payment
  //         callback_method: "get",
  //       };
  //       const paymentUrl = await razorPayInstance?.paymentLink.create(paymentLinkObject);
  //       if (paymentUrl?.short_url == null || paymentUrl?.short_url == undefined) {
  //         throw new Error("Product need to be rolled back because inventory is less than placed order");
  //       }
  //       return {
  //         isTrue: TRUE,
  //         message: "Payment link generated successfully",
  //         data: { paymentUrl },
  //       };
  //     } catch (ex) {
  //       return {
  //         isValid: false,
  //         //@ts-ignore
  //         message: [ex.message],
  //         data: {},
  //       };
  //     }
  //   };

  //   generatePaymentLink = async (cartItemsToOrder: any, refId: string) => {
  //     try {
  //       // Generate Razor Pay payment Link

  //       if (process.env.STRIPE_SECRET_KEY == undefined)
  //         return {
  //           isTrue: FALSE,
  //           message: "STRIPE_SECRET_KEY is not defined",
  //           data: {},
  //         };
  //       const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  //       const paymentMethod = await stripe.paymentMethods.create({
  //         type: "card",
  //         card: {
  //           number: "4242424242424242", // Replace with the actual card number
  //           exp_month: 12, // Replace with the actual expiration month
  //           exp_year: 23, // Replace with the actual expiration year
  //           cvc: "123", // Replace with the actual CVC
  //         },
  //       });
  //       console.log(paymentMethod);

  //       const paymentIntent = await stripe.paymentIntents.create({
  //         amount: 5000 * 100, // Stripe amount is in cents
  //         currency: "inr",
  //         confirm: true,
  //         return_url: "http://localhost:5173/",
  //         payment_method: paymentMethod.id,
  //         payment_method_types: ["card"],
  //       });
  //       console.log("Intent==>", paymentIntent);
  //       //@ts-ignore
  //       //   const payment = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: "pm_card_visa", return_url: "http://localhost:5173/" });
  //       //   console.log("payment==>", payment);

  //       //   const dummySource = {
  //       //     object: "card",
  //       //     number: "4242424242424242", // A valid card number for testing
  //       //     exp_month: 12, // Expiry month (e.g., 12)
  //       //     exp_year: 30, // Expiry year (e.g., 30)
  //       //     cvc: "123", // Card security code (e.g., 123)
  //       //   };

  //       //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  //       //   //@ts-ignore
  //       //   const charge = await stripe.charges.create({
  //       //     amount: 1000, // Amount in cents
  //       //     currency: "inr",
  //       //     source: {
  //       //       object: "card",
  //       //       number: "4242424242424242", // A valid card number for testing
  //       //       exp_month: 12, // Expiry month (e.g., 12)
  //       //       exp_year: 30, // Expiry year (e.g., 30)
  //       //       cvc: "123",
  //       //     }, // Use the dummy source object
  //       //     description: "Test payment",
  //       //   });
  //       //   console.log(charge);

  //       /////// Working ///////////////////////
  //       const { cartItem } = cartItemsToOrder;

  //       //@ts-ignore
  //       const lineItems = cartItem.map((items) => {
  //         return {
  //           price_data: {
  //             currency: "inr",
  //             product_data: {
  //               name: items.productName,
  //             },
  //             //@ts-ignore
  //             unit_amount: items.productPrice * 100,
  //           },
  //           quantity: items.quantity,
  //         };
  //       });

  //       if (process.env.STRIPE_SECRET_KEY == undefined)
  //         return {
  //           isTrue: FALSE,
  //           message: "STRIPE_SECRET_KEY is not defined",
  //           data: {},
  //         };
  //       //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  //       const res = await stripe.checkout.sessions.create({
  //         payment_method_types: ["card"],
  //         line_items: lineItems,
  //         mode: "payment",
  //         success_url: "http://localhost:5173/",
  //         cancel_url: "https://example-cancel-url.com/",
  //         client_reference_id: refId,
  //       });
  //       console.log(res);

  //       //////////// Working/////////////
  //       return {
  //         isTrue: TRUE,
  //         message: "Payment link generated successfully",
  //         data: {},
  //       };
  //     } catch (ex) {
  //       return {
  //         isValid: false,
  //         //@ts-ignore
  //         message: [ex.message],
  //         data: {},
  //       };
  //     }
  //   };

  makePaymentAndUpdateInventory = async (cartItemsToOrder: any, refId: string) => {
    const session = await mongoose.startSession();
    console.log("Call from ui");
    session.startTransaction();
    let errorList: string[] = [];
    let productNotAvaiable = [];
    let updatedCart = [];
    try {
      let areProductInInventory = true;
      let isSuccessfulPayment = true;

      let totalProductPrice: number = 0;

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

      let isPaymentSuccess;
      const timeOutId = setTimeout(() => {}, 60000);

      //@ts-ignore
      if (this.paymentStatusFromUI.payemtSuccess == false) {
        errorList.push("Payment Fail");
        throw new Error("Payment failed");
      } else {
        // Make the OrderTable
      }

      if (areProductInInventory) {
        await session.commitTransaction();
        session.endSession();

        return {
          isTrue: TRUE,
          message: ["Inventory Updated"],
          data: {},
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

  checkPaymentSuccess = async (paymentStatusBody: any) => {
    console.log("paymentStatmenr=>", paymentStatusBody);
    this.paymentStatusFromUI = paymentStatusBody.payemtSuccess;
    console.log(this.paymentStatusFromUI);
  };
}

export default PlaceOrderService;
