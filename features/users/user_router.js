import express from "express";

import authEndpoints from "./auth/auth_endpoints.js";
const router = express.Router();

router.use("/auth", authEndpoints);

export default router;
