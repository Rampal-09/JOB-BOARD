import { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext.jsx";
import { getMyApplications } from "../api/job.js";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
  applied: { bg: "#eff6ff", color: "#1d4ed8" },
  shortlisted: { bg: "#fefce8", color: "#a16207" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
  hired: { bg: "#f0fdf4", color: "#16a34a" },
};

export default function SeekerDash() {
  const { user, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((data) => setApps(data.applications))
      .finally(() => setLoading(false));
  }, []);

  const hired = apps.filter((a) => a.status === "hired").length;
  const shortlisted = apps.filter((a) => a.status === "shortlisted").length;

  return (
    <div style={s.page}>
      {/* Top bar */}
      <div style={s.topbar}>
        <div>
          <h1 style={s.heading}>My Dashboard</h1>
          <p style={s.sub}>{user?.email}</p>
        </div>
        <div style={s.topActions}>
          <Link to="/browse" style={s.browseBtn}>
            Browse Jobs
          </Link>
          <button style={s.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={s.statNum}>{apps.length}</p>
          <p style={s.statLabel}>Total Applied</p>
        </div>
        <div style={s.statCard}>
          <p style={{ ...s.statNum, color: "#a16207" }}>{shortlisted}</p>
          <p style={s.statLabel}>Shortlisted</p>
        </div>
        <div style={s.statCard}>
          <p style={{ ...s.statNum, color: "#16a34a" }}>{hired}</p>
          <p style={s.statLabel}>Hired</p>
        </div>
      </div>

      {/* Application list */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>My Applications</h2>

        {loading && <p style={s.muted}>Loading...</p>}
        {!loading && apps.length === 0 && (
          <p style={s.muted}>
            No applications yet. <Link to="/browse">Browse jobs</Link>
          </p>
        )}

        {apps.map((app) => (
          <div key={app.id} style={s.appRow}>
            <div style={s.appLeft}>
              <p style={s.jobTitle}>{app.job?.title}</p>
              <p style={s.jobMeta}>
                {app.job?.recruiter?.name} · {app.job?.location} ·{" "}
                {app.job?.type}
              </p>
              <p style={s.date}>
                Applied {new Date(app.applied_at).toLocaleDateString()}
              </p>
            </div>
            <div style={s.appRight}>
              <span
                style={{
                  ...s.statusBadge,
                  background: STATUS_COLORS[app.status]?.bg,
                  color: STATUS_COLORS[app.status]?.color,
                }}
              >
                {app.status}
              </span>
              <Link to={`/jobs/${app.job?.id}`} style={s.viewLink}>
                View job →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: "900px", margin: "0 auto", padding: "1.5rem 1rem" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  heading: { fontSize: "1.4rem", fontWeight: "700", color: "#111" },
  sub: { fontSize: "13px", color: "#6b7280", marginTop: "2px" },
  topActions: { display: "flex", gap: "10px" },
  browseBtn: {
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
  section: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "1rem",
  },
  muted: {
    fontSize: "13px",
    color: "#9ca3af",
    textAlign: "center",
    padding: "2rem",
  },
  appRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
    gap: "1rem",
  },
  appLeft: { flex: 1 },
  appRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
  },
  jobTitle: { fontSize: "14px", fontWeight: "500", color: "#111" },
  jobMeta: { fontSize: "12px", color: "#6b7280", marginTop: "2px" },
  date: { fontSize: "11px", color: "#9ca3af", marginTop: "3px" },
  statusBadge: {
    fontSize: "11px",
    padding: "3px 9px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  viewLink: { fontSize: "12px", color: "#4f46e5" },
};
