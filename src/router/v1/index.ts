// import express from "express";
// const router = express.Router();
// // import  {
// //   ProductCreationController,
// //   // SignUpController,
// //   // SignInController,
// //   // WishListController

// // } from "../../controller/index";

// import ProductCreationController from "../../controller/productCreateController"
// import SignInController from "../../controller/signInController"
// import SignUpController from "../../controller/signUpController";
// import WishListController from "../../controller/userWishList";
// import UserCartistController from "../../controller/userCartList";
// import {verifyAddProdutToWishLsitOrCartRequestMiddleWare, verifyUserDetails} from "../../middlewares/userSignIn"

// import AddProductToCartOrWishListController from "../../controller/addProductTocartOrWishList";

// const productCreateController = new ProductCreationController();
// const signUpController=new SignUpController();
// const signInController=new SignInController();
// const wishListController=new WishListController();
// const userCartController=new UserCartistController();
// const addProductController=new AddProductToCartOrWishListController();
// // const dataEngineController = new DataEngineController();

// //SIGN UP and Sign in user and Authentication of the user
// router.post("/sign-up",signUpController.addNewUser);
// router.post("/sign-in",verifyUserDetails,signInController.signInUser)

// //Product Relate API
// router.post("/add-product", productCreateController.addNewProduct);
// router.post("/add-wishlist",verifyUserDetails,wishListController.addToUserWishList)
// router.post("/add-cart",userCartController.addToCartList);

// //second time when user is signed in and has a token, this api will be called to add in cart or wishlist
// router.post("/add-cw-product",verifyAddProdutToWishLsitOrCartRequestMiddleWare,addProductController.addProductToCartController);

// // module.exports = router;

// export default router

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

const signUpController = new SignUpController();
const allocateAdmin = new AdminAllocate();
const deleteUserController = new DeleteUserContoller();
const signInController = new SignInUserController();
const wishListController = new WishListController();
const updateCartController = new UpdateCartController();
const productController = new AddProductController();

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

// Admin Related API
router.delete("/delete-user", verifyAdminUser("/delete-user"), deleteUserController.deleteUser);
router.post("/add-product", verifyAdminUser("/add-product"), productController.addNewProduct);
router.delete("/delete-product", verifyAdminUser("/delete-product"), productController.deleteProduct);
router.post("/filter-product", productController.filterProduct);
export default router;
