//import authenticateToken  from '../middlewares/authenticateToken.js';
import dotenv from "dotenv";
dotenv.config();
import authModel from "./auth_model.js";
import express from "express";
const router = express.Router();

// --------------------
//    user Endpoints
// --------------------

router.post("/register/v1", async (req, res, next) => {
  try {
    let checkAllUsers = await authModel.getByEmailOrUsername(req.body);

    if (checkAllUsers.length > 0) {
      return res.status(401).json({ msg: "email or username already stored in DB" });
    }

    const resgiterResponse = await authModel.registerUser(req.body);
    let token = await authModel.authenticateUser(req.body);

    return res.status(200).json({
      user_id: resgiterResponse[0].insertId,
      msg: "User aded to database",
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
