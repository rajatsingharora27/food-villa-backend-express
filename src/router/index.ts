import express from "express";
import v1ApiRotes from "./v1/index";
const router = express.Router();

router.use("/api/v1", v1ApiRotes);

export default router;
