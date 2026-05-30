import express from "express";
const uploadRoute = Express.Router();
import { authenticate } from "../middleware/authMiddleware";
import { uploadResume } from "../middleware/uploadMiddleware";
import { supabase } from "../services/supabase.service";

uploadRoute.post(
  "/resume",
  authenticate, // must be logged in
  uploadResume, // multer parses multipart/form-data
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { jobId } = req.body;
      const userId = req.user.id; // from JWT middleware

      // 1. Upload PDF buffer to Supabase Storage
      const resumeUrl = await uploadToSupabase(
        req.file.buffer,
        req.file.originalname,
        userId,
      );

      // 2. Save application record to DB
      const { data, error } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          seeker_id: userId,
          resume_url: resumeUrl,
          cover_note: req.body.coverNote ?? "",
          status: "applied",
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ message: "Applied!", application: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
);

export default uploadRoute;
