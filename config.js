import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  timezone: "+00:00",
});

// Log a message when the connection is created
db.getConnection()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Error establishing database connection:", err);
  });

export default db;
