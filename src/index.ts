import express from "express";
import apiRouter from "./router/index";
import bodyParser from "body-parser";
import cors from "cors";
import log from "./config/logger";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { connectDataBase } from "./config/mongoConfig";
import { FALSE } from "./constants/applicationConstants";
import formidable from "express-formidable";
// import { cludinaryConfigCreate } from "./config/cloudinaryConfig";

const dotenv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const app = express();

const startServer = async () => {
  const port = process.env.PORT;
  const swaggerUIJsDocs = YAML.load("api.yml");
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerUIJsDocs));

  connectDataBase();

  app.use("/food-villa/api/v1/add-product", formidable());

  // // Use bodyParser for other routes
  app.use("/food-villa", bodyParser.urlencoded({ extended: true }));
  app.use("/food-villa", bodyParser.json());

  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.json());
  // app.use(formidable());
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
