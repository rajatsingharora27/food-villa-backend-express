const express = require("express");
const dotenv = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const apiRouter = require("./router/index");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const log = require("./config/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const startServer = async () => {
  const port = process.env.PORT;

  const options = {
    swaggerDefinition: {
      openApi: "3.0.0",
      info: {
        title: "Food-Villa Application",
        version: "1.0.0",
        description: "all api backend express",
      },
      servers: [{ url: "http:localhost:8080/food-villa" }],
    },
    apis: ["./router/*.js"],
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  //Mongo Db connection
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  log.info("Connected to the DATABASE");

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
