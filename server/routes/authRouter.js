import express from "express";
import {
  sendOtp,
  verifyOtp,
  getMe,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const authRouter = express.Router();

authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.get("/me", authenticate, getMe);
authRouter.post("/logout", logout);

export default authRouter;
