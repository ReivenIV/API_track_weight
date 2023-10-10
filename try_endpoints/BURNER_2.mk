Please act as a senior back-end in nodejs and mysql. 

Hi GPT i have these <ENDPOINT> and these <MODEL> they are giving me these <ERROR> do you know what is it wrongi in my code ? 
to give you more context these is my global file <INDEX> and <CONFIG>


<INDEX>: ```
import express from 'express';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

//import endpoints
import userEndpoints from "./features/users/user_router.js";
import toolsEndpoints from "./tools/tools_router.js";

dotenv.config();

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/users', userEndpoints);
app.use('/tools', toolsEndpoints);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});


(async () => {
  try {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Error creating database pool:', error);
  }
})();

```


<CONFIG>: ```
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Log a message when the connection is created
db.getConnection()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((err) => {
    console.error('Error establishing database connection:', err);
  });

export default db;

```

<ENDPOINT>: ```
//import authenticateToken  from '../middlewares/authenticateToken.js';
import dotenv from "dotenv";
dotenv.config();
import userModel from './userModel.js'; 
import express from 'express';
const router = express.Router();

// --------------------
//    user Endpoints
// --------------------


  router.post(
    '/register/v1',
    async (req, res, next) => {
      try {
        let checkAllUsers = await userModel.getByEmailOrUsername(req.body);
        console.log(checkAllUsers);
        console.log(checkAllUsers);
        if (checkAllUsers.length > 0) {
          return res
            .status(401)
            .json({ msg: 'email or username already stored in DB' });
        }
        const resgiterResponse = await userModel.registerUser(req.body);
        let token = await userModel.authenticateUser(req.body);

        return res.status(200).json({
          user_id: resgiterResponse[0].insertId,
          msg: 'User aded to database',
          token: token,
        });
      } catch (error) {
        next(error);
      }
    },
  );

export default router;

````

<MODEL>: ```
import db from '../../../config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = bcrypt.genSaltSync(parseFloat(process.env.JWT_SALT_ROUNDS));

import dotenv from "dotenv";
dotenv.config();

// --------------------
//     user Model
// --------------------

class userModel {
  constructor() {
    this.db = db;
  }

   async getByEmailOrUsername(data) {
    console.log(data);
    const query ='SELECT * FROM `api_db_track`.`users` WHERE (email = ? OR username = ?)';
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
  
}

export default userModel;

````

<ERROR>: ```
[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
Listening on PORT: 8080
Database connection established successfully.
TypeError: userModel.getByEmailOrUsername is not a function
    at file:///home/heaven/Desktop/my_codes/API_track_weight/features/users/auth/userEndpoints.js:17:45
    at Layer.handle [as handle_request] (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/route.js:144:13)
    at Route.dispatch (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/route.js:114:3)
    at Layer.handle [as handle_request] (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/layer.js:95:5)
    at /home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/index.js:346:12)
    at next (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/index.js:280:10)
    at Function.handle (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/index.js:175:3)
    at router (/home/heaven/Desktop/my_codes/API_track_weight/node_modules/express/lib/router/index.js:47:12)

````