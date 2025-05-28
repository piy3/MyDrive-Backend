import express,{ Router } from "express";
import {loginUser, logoutUser, refreshAcessToken, registerUser} from '../Controllers/user.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const UserRouter = express.Router();

UserRouter.post('/register',registerUser);
UserRouter.post('/login',loginUser);
UserRouter.post('/logout',verifyJWT,logoutUser);
// UserRouter.post('/verifyJwt',verifyJWT); //to verify access token on server
UserRouter.post('/refreshToken',refreshAcessToken);

export default UserRouter;