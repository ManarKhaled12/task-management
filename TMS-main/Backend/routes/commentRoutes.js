import express from "express";
import { createComment, getComments } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/Create", createComment);
commentRouter.get("/GetComments", getComments);

export default commentRouter;
