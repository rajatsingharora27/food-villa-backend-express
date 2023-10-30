import express from "express";
import apiRouter from "./router/index";
import bodyParser from "body-parser";
import cors from "cors";

import log from "./config/logger";
const dotenv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { connectDataBase } from "./config/mongoConfig";
// import Stripe from "stripe";
import { FALSE } from "./constants/applicationConstants";

const app = express();

const startServer = async () => {
  const port = process.env.PORT;
  const swaggerUIJsDocs = YAML.load("api.yml");
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerUIJsDocs));
  // //Mongo Db connection

  connectDataBase();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  dotenv.use;

  app.use("/food-villa", apiRouter);

  app.listen(port, () => {
    log.info(`Listing to the ${port}`);
    log.info("****************************************************************");
    log.info("********FOOD_VILLA MICROSERVICE STARTED*************************");
    log.info("****************************************************************");
  });
};

startServer();
