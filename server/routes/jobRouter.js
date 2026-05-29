import express from "express";
import { authenticate, requireRole } from "../middleware/authMiddleware";
const Jobrouter = express.Router();

Jobrouter.get("/", (req, res) => {});
Jobrouter.get("/:id", (req, res) => {});

Jobrouter.post("/", authenticate, requireRole("recruiter"), (req, res) => {});
Jobrouter.put("/:id", authenticate, requireRole("recruiter"), (req, res) => {});
Jobrouter.delete(
  "/:id",
  authenticate,
  requireRole("recruiter"),
  (req, res) => {},
);

export default Jobrouter;
