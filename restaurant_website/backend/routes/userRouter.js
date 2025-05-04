import express from 'express';
import { loginUser, saveUsers } from '../controllers/userController.js';


const userRouter = express.Router();
userRouter.post("/", saveUsers);
userRouter.post("/login", loginUser);

export default userRouter;