import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

// ----------------------------------------
//   authenticateToken middleware global
// ----------------------------------------

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["x-access-token"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === undefined) {
    // Create an error object and pass it to the next middleware
    const error = new Error("Token not found");
    error.statusCode = 404;
    return next(error);
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // Create an error object and pass it to the next middleware
        const error = new Error("Token not valid");
        error.statusCode = 401;
        return next(error);
      } else {
        req.id = decoded.userId;
        next();
      }
    });
  }
}

export default authenticateToken;
