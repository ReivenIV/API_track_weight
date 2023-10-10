import db from "../../../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = bcrypt.genSaltSync(parseFloat(process.env.JWT_SALT_ROUNDS));

import dotenv from "dotenv";
dotenv.config();

// --------------------
//     user Model
// --------------------

class authModel {
  constructor() {
    this.db = db;
  }

  async getByEmailOrUsername(data) {
    console.log(data);
    const query =
      "SELECT * FROM `api_db_track`.`users` WHERE (email = ? OR username = ?)";
    const response = await this.db.query(query, [data.email, data.username]);

    return response[0];
  }

  async registerUser(data) {
    const passwordHashed = await bcrypt.hash(data.password, saltRounds);

    const response = await this.db.query(
      'INSERT INTO `api_db_track`.`users` (`username`, `password`, `email`, `created_at`,`timezone`, `role`) VALUES (?,?, ?, NOW(), ?, "client")',
      [data.username, passwordHashed, data.email, data.timezone],
    );
    return response;
  }

 async authenticateUser(data) {
    let existingUser = await userModel.getByEmailOrUsername(data);
    let token = jwt.sign({ userId: existingUser[0].id }, process.env.JWT_SECRET);

    return token;
  }
}

// Create an instance of authModel
const authModelInstance = new authModel(); 

export default authModelInstance;