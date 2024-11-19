import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import authenticateToken from "./middleware/authMiddleware.js";

import authRouter from "./routes/authRotes.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import userRouter from "./routes/userRoutes.js";
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/Auth", authRouter);
app.use("/api/Project", projectRouter);
app.use("/api/Task", taskRouter);
app.use("/api/Comment", commentRouter);
app.use("/api/User", userRouter);

app.get("/auth", authenticateToken, async (req, res) => {
  return res.json({ msg: "testing", req: req.user });
});

app.listen(5000, () => {
  console.log("Server Started");
});
