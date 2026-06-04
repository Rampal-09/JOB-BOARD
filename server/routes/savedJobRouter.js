import express from "express";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";
import {
  getMySavedJobs,
  saveJob,
  unsaveJob,
} from "../controllers/savedJobController.js";

const savedJobRouter = express.Router();

savedJobRouter.use(authenticate, requireRole("seeker"));

savedJobRouter.get("/", getMySavedJobs);
savedJobRouter.post("/:jobId", saveJob);
savedJobRouter.delete("/:jobId", unsaveJob);

export default savedJobRouter;
