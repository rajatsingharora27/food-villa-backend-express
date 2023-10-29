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
import Stripe from "stripe";
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

  let endpointSecret: string;
  // endpointSecret= "whsec_fa26315e188782648fa779beb867c5b670be9162849385661a5cc84bf8152cc4";

  app.post("/webhook", express.raw({ type: "application/json" }), (request, response) => {
    const sig = request.headers["stripe-signature"];
    console.log("webhook verified");
    let event;
    let data;
    let eventType;
    if (process.env.STRIPE_SECRET_KEY == undefined)
      return {
        isTrue: FALSE,
        message: "STRIPE_SECRET_KEY is not defined",
        data: {},
      };
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (endpointSecret) {
      try {
        //@ts-ignore
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err} `);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          // Then define and call a function to handle the event payment_intent.succeeded
          console.log("Payment Intent");
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } else {
      data = request.body.data.object;
      eventType = request.body.type;
    }

    if (eventType === "checkout.session.completed") {
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  });

  app.listen(port, () => {
    log.info(`Listing to the ${port}`);
    log.info("****************************************************************");
    log.info("********FOOD_VILLA MICROSERVICE STARTED*************************");
    log.info("****************************************************************");
  });
};

startServer();
