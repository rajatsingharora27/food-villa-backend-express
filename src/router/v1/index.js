const express = require("express");
const router = express.Router();
const {
  ProductCreationController,
  SignUpController

} = require("../../controller/index");

const productCreateController = new ProductCreationController();
const signUpController=new SignUpController();
// const dataEngineController = new DataEngineController();


//SIGN UP user
router.post("/sign-up",signUpController.addNewUser);



//Product Relate API
router.post("/add-product", productCreateController.addNewProduct);


module.exports = router;