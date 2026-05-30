import { api } from "./auth";

// ── Public ────────────────────────────────

export const fetchJobs = (params = {}) =>
  api.get("/jobs", { params }).then((r) => r.data);

export const fetchJobById = (id) => api.get(`/jobs/${id}`).then((r) => r.data);

// ── Recruiter ─────────────────────────────
export const createJob = (jobData) =>
  api.post("/jobs", jobData).then((r) => r.data);

export const updateJob = (id, jobData) =>
  api.put(`/jobs/${id}`, jobData).then((r) => r.data);

export const closeJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);
