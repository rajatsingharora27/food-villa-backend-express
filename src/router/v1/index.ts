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

import {verifyUserDetails} from "../../middlewares/userSignIn"

const productCreateController = new ProductCreationController();
// const signUpController=new SignUpController();
const signInController=new SignInController();
// const wishListController=new WishListController();
// const dataEngineController = new DataEngineController();


//SIGN UP and Sign in user and Authentication of the user 
// router.post("/sign-up",signUpController.addNewUser);
router.post("/sign-in",verifyUserDetails,signInController.signInUser)



//Product Relate API
router.post("/add-product", productCreateController.addNewProduct);
// router.post("/add-wishlist",verifyUserSignUpDetailMiddleWare,wishListController.addToUserWishList)


// module.exports = router;

export default router