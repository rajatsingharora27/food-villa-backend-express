const express = require("express");
const router = express.Router();
const {
  ProductCreationController,

} = require("../../controller/index");

const productCreateController = new ProductCreationController();
// const dataEngineController = new DataEngineController();

router.post("/add-product", productCreateController.addNewProduct);


module.exports = router;