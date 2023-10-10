const express = require("express");
const dotenv = require("dotenv").config();
const apiRouter =require("./router/index")
const bodyParser=require("body-parser")
const app = express();
const cors = require("cors");



const startServer = () => {
  const port=process.env.PORT

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  dotenv.use;

  app.use("/food-villa", apiRouter);
  app.listen(port, () => {
    console.log(`listning to ${port}`);
  });
};

startServer();
