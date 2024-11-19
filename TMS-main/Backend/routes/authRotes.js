import express from "express";
import { login, register } from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.post("/Register", register);
authRouter.post("/Login", login);

export default authRouter;
