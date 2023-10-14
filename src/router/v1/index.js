const express = require("express");
const router = express.Router();
const {
  ProductCreationController,
  SignUpController,
  SignInController,
  WishListController

} = require("../../controller/index");

const {verifyUserSignUpDetailMiddleWare}=require("../../middlewares/userSignIn")

const productCreateController = new ProductCreationController();
const signUpController=new SignUpController();
const signInController=new SignInController();
const wishListController=new WishListController();
// const dataEngineController = new DataEngineController();


//SIGN UP and Sign in user and Authentication of the user 
router.post("/sign-up",signUpController.addNewUser);
router.post("/sign-in",verifyUserSignUpDetailMiddleWare,signInController.signInUser)



//Product Relate API
router.post("/add-product", productCreateController.addNewProduct);
router.post("/add-wishlist",verifyUserSignUpDetailMiddleWare,wishListController.addToUserWishList)


module.exports = router;