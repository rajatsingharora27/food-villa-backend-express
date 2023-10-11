const express = require("express");
const dotenv = require('dotenv').config({path:`.env.${process.env.NODE_ENV}`});
const apiRouter =require("./router/index")
const bodyParser=require("body-parser")
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");


const startServer =async () => {
  const port=process.env.PORT

  //Mongo Db connection
  mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
console.log("connected to db")

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
