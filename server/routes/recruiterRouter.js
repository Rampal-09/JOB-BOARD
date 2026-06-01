import express from "express";
const recruiterRoute = express.Router();

router.use(authenticate, requireRole("recruiter"));

router.get("/jobs", getMyJobs);
router.get("/jobs/:jobId/applicants", getApplicants);
router.patch("/applications/:appId/status", updateStatus);
router.get("/applications/:appId/resume", getResumeUrl);

export default recruiterRoute;
