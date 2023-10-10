import db from "../../config.js";

class DatabaseConnection {
  constructor() {
    // Initialize the database connection
    this.db = db;
  }

  async testConnection(req, res) {
    try {
      // Attempt to connect to the database
      await this.db.getConnection();
      res.status(200).json({ message: "Database connection successful" });
    } catch (error) {
      console.error("Database connection error:", error.message);
      res.status(500).json({ error: "Database connection error" });
    }
  }
}

export default DatabaseConnection;
