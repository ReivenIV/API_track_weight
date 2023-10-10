import express from "express";
import DatabaseConnection from "./dbConnectionModel.js";

const router = express.Router();
const dbConnection = new DatabaseConnection(); // Create an instance of the class

// Database connection test endpoint
router.get("/test/db_connection", async (req, res) => {
  await dbConnection.testConnection(req, res); // Call the testConnection method
});

export default router;
