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
// import Stripe from "stripe";
import crypto from "crypto";
import ProductRetrivecontroller from "../../controller/productRetriveController";

const signUpController = new SignUpController();
const allocateAdmin = new AdminAllocate();
const deleteUserController = new DeleteUserContoller();
const signInController = new SignInUserController();
const wishListController = new WishListController();
const updateCartController = new UpdateCartController();
const productController = new AddProductController();
const forgotPasswordController = new ForgotPasswordController();
const placeOrderController = new PlaceOrderController();
const prductRetriveController = new ProductRetrivecontroller();

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
router.get("/get-product", prductRetriveController.getProductcontroller);
router.get("/get-random", prductRetriveController.getRandon8Products);

// Admin Related API
router.delete("/delete-user", verifyAdminUser("/delete-user"), deleteUserController.deleteUser);
router.post("/add-product", verifyAdminUser("/add-product"), productController.addNewProduct);
router.get("/get-product-by-id", productController.getProduct);
router.delete("/delete-product", verifyAdminUser("/delete-product"), productController.deleteProduct);
router.post("/filter-product", productController.filterProduct);
router.post("/place-order", placeOrderController.placeOrderUserController);
router.post("/payment-fail", placeOrderController.paymentStatusController);
router.post("/payment-success", placeOrderController.paymentSuccessController);
router.post("/webhook", (req: Request, res: Response) => {
  console.log("inWebhook");
});

//Webhook
// router.post("/validatePayment", (req, res) => {
//   const secret = "abcd12345";
//   console.log(req.body);

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   console.log(digest, req.headers["x-razorpay-signature"]);

//   if (digest === req.headers["x-razorpay-signature"]) {
//     console.log("request is legit");
//     console.log(JSON.stringify(req.body, null, 4));
//   } else {
//     // ignore it
//   }
//   res.json({ status: "ok" });
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
