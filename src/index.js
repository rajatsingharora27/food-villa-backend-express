const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
dotenv.use();
const port = 8082;

const startServer = () => {
  app.listen(port, () => {
    console.log(`listning to ${port}`);
  });
};

startServer();
