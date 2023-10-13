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
    const query =
      "SELECT * FROM `track_weight_db`.`user` WHERE (email = ? OR username = ?)";
    const response = await this.db.query(query, [data.email, data.username]);

    return response[0];
  }

  async registerUser(data) {
    const passwordHashed = await bcrypt.hash(data.password, saltRounds);

    const response = await this.db.query(
      'INSERT INTO `track_weight_db`.`user` (`username`, `password`, `email`, `created_at`, `role`) VALUES (?,?,?,NOW(),"client")',
      [data.username, passwordHashed, data.email],
    );
    return response;
  }

 async authenticateUser(data) {
  const authModelInstance = new authModel();  
  let existingUser = await authModelInstance.getByEmailOrUsername(data);

  if(!existingUser[0]){
    throw new Error("User not found");
  }

  let token = jwt.sign({ userId: existingUser[0].id }, process.env.JWT_SECRET);

    return token;
  }
}

// Create an instance of authModel for export 
const authModelInstanceGlobal = new authModel(); 

export default authModelInstanceGlobal;