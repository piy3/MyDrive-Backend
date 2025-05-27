import express,{ Router } from "express";
import {loginUser, logoutUser, registerUser} from '../Controllers/user.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const UserRouter = express.Router();

UserRouter.post('/register',registerUser);
UserRouter.post('/login',loginUser);
UserRouter.post('/logout',verifyJWT,logoutUser);

export default UserRouter;