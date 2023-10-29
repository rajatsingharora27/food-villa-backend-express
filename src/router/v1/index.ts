import express, { Request, Response } from "express";
const router = express.Router();
import SignUpController from "../../controller/signUpController";
import verifyUserDetails from "../../middlewares/verifyUserDetails";
import AdminAllocate from "../../controller/allocateAdmin";
import { verifyAdminUser } from "../../middlewares/verifyAdmin";
import DeleteUserContoller from "../../controller/deleteUserController";
import verifyUserSignInDetails from "../../middlewares/verifySignInDetails";

import vrifyUserExistAndPassWord from "../../middlewares/vrifyUserExistAndPasswordMiddleware";
import SignInUserController from "../../controller/signInUserController";
import { verifyUserToken } from "../../middlewares/verifyUserToken";
import WishListController from "../../controller/wishlistUpdateController";
import UpdateCartController from "../../controller/updateCart";
import AddProductController from "../../controller/addProductController";
import ForgotPasswordController from "../../controller/forgotPasswordController";
import PlaceOrderController from "../../controller/placeOrderController";
import { FALSE } from "../../constants/applicationConstants";
import Stripe from "stripe";

const signUpController = new SignUpController();
const allocateAdmin = new AdminAllocate();
const deleteUserController = new DeleteUserContoller();
const signInController = new SignInUserController();
const wishListController = new WishListController();
const updateCartController = new UpdateCartController();
const productController = new AddProductController();
const forgotPasswordController = new ForgotPasswordController();
const placeOrderController = new PlaceOrderController();

//General When we want to create an admin
router.post("/sign-up-admin", verifyUserDetails, allocateAdmin.addAdmin);

router.post("/sign-up", verifyUserDetails, signUpController.signUpUser);
router.post("/sign-in", verifyUserSignInDetails, vrifyUserExistAndPassWord, signInController.userSign);
router.post("/filter-product-admin", verifyAdminUser("/filter-products-admin"), productController.filterProductAdmin);

//if add to wish lißst field is true in request then only add other wise no nee to go ahead
// block this in api verification middle ware only

// user Related API
router.post("/wishlist-update", verifyUserToken, wishListController.updateWishListDataOfUser);
router.post("/cart-update", verifyUserToken, updateCartController.updateCartListDataOfUser);
router.post("/forgot-password", verifyUserSignInDetails, forgotPasswordController.forgotPassword);

// Admin Related API
router.delete("/delete-user", verifyAdminUser("/delete-user"), deleteUserController.deleteUser);
router.post("/add-product", verifyAdminUser("/add-product"), productController.addNewProduct);
router.delete("/delete-product", verifyAdminUser("/delete-product"), productController.deleteProduct);
router.post("/filter-product", productController.filterProduct);
router.post("/place-order", placeOrderController.placeOrderUserController);
router.post("/payment-status", placeOrderController.paymentStatusController);
router.post("/webhook", (req: Request, res: Response) => {
  console.log("inWebhook");
});

//Webhook
// router.post("/webhook", express.raw({ type: "application/json" }), (request: Request, response: Response) => {
//   let endpointSecret: string = "";
//   // endpointSecret= "whsec_fa26315e188782648fa779beb867c5b670be9162849385661a5cc84bf8152cc4";
//   const sig = request.headers["stripe-signature"];
//   console.log("webhook verified");
//   let event;
//   let data;
//   let eventType;
//   if (process.env.STRIPE_SECRET_KEY == undefined)
//     return {
//       isTrue: FALSE,
//       message: "STRIPE_SECRET_KEY is not defined",
//       data: {},
//     };
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//   if (endpointSecret) {
//     try {
//       //@ts-ignore
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err} `);
//       return;
//     }

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntentSucceeded = event.data.object;
//         // Then define and call a function to handle the event payment_intent.succeeded
//         console.log("paymentIntentSucceeded");
//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//   } else {
//     data = request.body.data.object;
//     eventType = request.body.type;
//   }

//   if (eventType === "checkout.session.completed") {
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send().end();
// });

/**
 * Update product API
 * Order API
 * Payment API
 * Forgot Password API --> DONE
 * Message / Mail API  (on order placed)
 *
 *
 *
 */

export default router;
