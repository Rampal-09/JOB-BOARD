import { api } from "./auth"; // reuse axios instance with token interceptor

export const getMyJobs = () => api.get("/recruiter/jobs").then((r) => r.data);

export const getApplicants = (jobId) =>
  api.get(`/recruiter/jobs/${jobId}/applicants`).then((r) => r.data);

export const updateAppStatus = (appId, status) =>
  api
    .patch(`/recruiter/applications/${appId}/status`, { status })
    .then((r) => r.data);

export const downloadResume = (appId) =>
  api.get(`/recruiter/applications/${appId}/resume`).then((r) => r.data);
