import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRouter from "../routes/authRouter.js";
import Jobrouter from "../routes/jobRouter.js";

app.use("/api/v1/auth", authRouter);
app.use("api/v1/jobs", Jobrouter);

export default app;
