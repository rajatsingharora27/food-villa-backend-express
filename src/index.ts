import express from "express";
import apiRouter from "./router/index";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import log  from "./config/logger";
const dotenv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const app = express();




const startServer = async () => {
  const port = process.env.PORT;

  //Mongo Db connection

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI environment variable is not defined.");
  } else {
    mongoose.connect(mongoUri)
    .then(() => {
     log.info("Connected to MongoDB");
    })
    .catch((error) => {
      log.error("MongoDB connection error:", error);
    });
  }

  // await mongoose.connect(process.env.MONGODB_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // log.info("Connected to the DATABASE");

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  dotenv.use;

  app.use("/food-villa", apiRouter);
  app.listen(port, () => {
    log.info(`Listing to the ${port}`);
    log.info(
      "****************************************************************"
    );
    log.info(
      "********FOOD_VILLA MICROSERVICE STARTED*************************"
    );
    log.info(
      "****************************************************************"
    );
  });
};

startServer();
