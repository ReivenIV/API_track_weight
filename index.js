import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

// Global middlewares
import errorHandler from "./middlewares/errorHandler.js";
import requestHandler from "./tools/requests_api/request_handler.js";

// import endpoints
import userEndpoints from "./features/users/user_router.js";
import toolsEndpoints from "./tools/tools_router.js";

dotenv.config();

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.use(errorHandler)
app.use(requestHandler)


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", userEndpoints);
app.use("/tools", toolsEndpoints);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

(async () => {
  try {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Error creating database pool:", error);
  }
})();
