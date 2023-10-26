import express from "express";
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
