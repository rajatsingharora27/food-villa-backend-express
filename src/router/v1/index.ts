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

const signUpController = new SignUpController();
const allocateAdmin = new AdminAllocate();
const deleteUserController = new DeleteUserContoller();
const signInController = new SignInUserController();

router.post("/sign-up", verifyUserDetails, signUpController.signUpUser);
router.post("/sign-up-admin", verifyUserDetails, allocateAdmin.addAdmin);
router.post("/sign-in", verifyUserSignInDetails, vrifyUserExistAndPassWord, signInController.userSign);

//if add to wish list field is true in request then only add other wise no nee to go ahead
// block this in api verification middle ware only

// verifyUserToken
router.post("/wishlit-update");
router.delete("/delete-user", verifyAdminUser, deleteUserController.deleteUser);
export default router;
