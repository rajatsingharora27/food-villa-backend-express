import express from "express";
const router = express.Router();
// import  {
//   ProductCreationController,
//   // SignUpController,
//   // SignInController,
//   // WishListController

// } from "../../controller/index";

import ProductCreationController from "../../controller/productCreateController"
import SignInController from "../../controller/signInController"
import SignUpController from "../../controller/signUpController";
import WishListController from "../../controller/userWishList";
import UserCartistController from "../../controller/userCartList";
import {verifyAddProdutToWishLsitOrCartRequestMiddleWare, verifyUserDetails} from "../../middlewares/userSignIn"

import AddProductToCartOrWishListController from "../../controller/addProductTocartOrWishList";

const productCreateController = new ProductCreationController();
const signUpController=new SignUpController();
const signInController=new SignInController();
const wishListController=new WishListController();
const userCartController=new UserCartistController();
const addProductController=new AddProductToCartOrWishListController();
// const dataEngineController = new DataEngineController();


//SIGN UP and Sign in user and Authentication of the user 
router.post("/sign-up",signUpController.addNewUser);
router.post("/sign-in",verifyUserDetails,signInController.signInUser)



//Product Relate API
router.post("/add-product", productCreateController.addNewProduct);
router.post("/add-wishlist",verifyUserDetails,wishListController.addToUserWishList)
router.post("/add-cart",userCartController.addToCartList);
router.post("/add-cw-product",verifyAddProdutToWishLsitOrCartRequestMiddleWare,addProductController.addProductToCartController);


// module.exports = router;

export default router