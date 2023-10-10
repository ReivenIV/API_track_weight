import express from "express";

import dbConectionEndpoints from "./db_connection/endpoints.js";
const router = express.Router();

router.use("/", dbConectionEndpoints);

export default router;
