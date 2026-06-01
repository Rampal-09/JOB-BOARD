import { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext.jsx";
import { getMyJobs } from "../api/recruiter.js";
import { ApplicantList } from "../components/ApplicantList.jsx";
import { Link } from "react-router-dom";

export default function RecruiterDash() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // job to show applicants for

  useEffect(() => {
    getMyJobs()
      .then((data) => setJobs(data.jobs))
      .finally(() => setLoading(false));
  }, []);

  // Stats derived from jobs data
  const totalApps = jobs.reduce(
    (sum, j) => sum + (j.applications?.[0]?.count ?? 0),
    0,
  );
  const openJobs = jobs.filter((j) => j.status === "open").length;

  return (
    <div style={s.page}>
      {/* ── Top bar ── */}
      <div style={s.topbar}>
        <div>
          <h1 style={s.heading}>Recruiter Dashboard</h1>
          <p style={s.sub}>{user?.email}</p>
        </div>
        <div style={s.topActions}>
          <Link to="/post-job" style={s.postBtn}>
            + Post Job
          </Link>
          <button style={s.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      {/* ── Stats ── */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={s.statNum}>{jobs.length}</p>
          <p style={s.statLabel}>Total Jobs Posted</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statNum}>{openJobs}</p>
          <p style={s.statLabel}>Open Positions</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statNum}>{totalApps}</p>
          <p style={s.statLabel}>Total Applications</p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={s.cols}>
        {/* Left — job list */}
        <div style={s.jobList}>
          <h2 style={s.sectionTitle}>Your Jobs</h2>
          {loading && <p style={s.muted}>Loading...</p>}
          {!loading && jobs.length === 0 && (
            <p style={s.muted}>
              No jobs yet. <Link to="/post-job">Post one!</Link>
            </p>
          )}

          {jobs.map((job) => (
            <div
              key={job.id}
              style={selectedJob?.id === job.id ? s.jobRowActive : s.jobRow}
              onClick={() => setSelectedJob(job)}
            >
              <div style={s.jobRowLeft}>
                <p style={s.jobTitle}>{job.title}</p>
                <p style={s.jobMeta}>
                  {job.location} · {job.type}
                </p>
              </div>
              <div style={s.jobRowRight}>
                <span
                  style={job.status === "open" ? s.badgeOpen : s.badgeClosed}
                >
                  {job.status}
                </span>
                <p style={s.appCount}>
                  {job.applications?.[0]?.count ?? 0} applicants
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — applicants panel */}
        <div style={s.applicantsPanel}>
          {selectedJob ? (
            <ApplicantList
              job={selectedJob}
              onStatusChange={(appId, newStatus) => {
                // Update count locally if rejected/hired
              }}
            />
          ) : (
            <div style={s.emptyPanel}>
              <p>👈 Select a job to view applicants</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  heading: { fontSize: "1.4rem", fontWeight: "700", color: "#111" },
  sub: { fontSize: "13px", color: "#6b7280", marginTop: "2px" },
  topActions: { display: "flex", gap: "10px", alignItems: "center" },
  postBtn: {
    padding: "8px 18px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    textDecoration: "none",
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "12px",
    marginBottom: "1.5rem",
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
  },
  statNum: { fontSize: "1.8rem", fontWeight: "700", color: "#4f46e5" },
  statLabel: { fontSize: "12px", color: "#6b7280", marginTop: "2px" },
  cols: {
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: "16px",
    alignItems: "start",
  },
  jobList: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "0.75rem",
  },
  muted: {
    fontSize: "13px",
    color: "#9ca3af",
    padding: "1rem 0",
    textAlign: "center",
  },
  jobRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 8px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "4px",
    border: "1px solid transparent",
  },
  jobRowActive: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 8px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "4px",
    border: "1px solid #6366f1",
    background: "#eef2ff",
  },
  jobRowLeft: { flex: 1 },
  jobRowRight: { textAlign: "right" },
  jobTitle: { fontSize: "13px", fontWeight: "500", color: "#111" },
  jobMeta: { fontSize: "12px", color: "#9ca3af", marginTop: "2px" },
  badgeOpen: {
    fontSize: "11px",
    background: "#ecfdf5",
    color: "#059669",
    padding: "2px 7px",
    borderRadius: "20px",
  },
  badgeClosed: {
    fontSize: "11px",
    background: "#f3f4f6",
    color: "#6b7280",
    padding: "2px 7px",
    borderRadius: "20px",
  },
  appCount: { fontSize: "11px", color: "#9ca3af", marginTop: "4px" },
  applicantsPanel: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem",
    minHeight: "400px",
  },
  emptyPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    color: "#9ca3af",
    fontSize: "14px",
  },
};
