import mongoose from "mongoose";
import log from "./logger";

export const connectDataBase = async () => {
  //Mongo Db connection

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI environment variable is not defined.");
  } else {
    await mongoose
      .connect(mongoUri)
      .then(() => {
        log.info("Connected to MongoDB");
      })
      .catch((error) => {
        log.error("MongoDB connection error:", error);
      });
  }
};
