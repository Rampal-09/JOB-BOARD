import { useState, useEffect } from "react";
import {
  getApplicants,
  updateAppStatus,
  downloadResume,
} from "../api/recruiter.js";

const STATUS_COLORS = {
  applied: { bg: "#eff6ff", color: "#1d4ed8" },
  shortlisted: { bg: "#fefce8", color: "#a16207" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
  hired: { bg: "#f0fdf4", color: "#16a34a" },
};

export function ApplicantList({ job }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // appId being updated

  useEffect(() => {
    setLoading(true);
    getApplicants(job.id)
      .then((data) => setApplicants(data.applicants))
      .finally(() => setLoading(false));
  }, [job.id]); // re-fetch when selected job changes

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await updateAppStatus(appId, newStatus);
      // Update locally — no need to re-fetch
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDownload = async (appId, seekerName) => {
    try {
      const { url } = await downloadResume(appId);
      // Open signed URL in new tab — browser downloads the PDF
      window.open(url, "_blank");
    } catch (err) {
      console.error("Resume download failed", err);
    }
  };

  return (
    <div>
      <h2 style={s.title}>{job.title}</h2>
      <p style={s.sub}>
        {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
      </p>

      {loading && <p style={s.muted}>Loading applicants...</p>}

      {!loading && applicants.length === 0 && (
        <p style={s.muted}>No applications yet for this job.</p>
      )}

      {applicants.map((app) => (
        <div key={app.id} style={s.appRow}>
          {/* Seeker info */}
          <div style={s.seekerInfo}>
            <div style={s.avatar}>
              {(app.seeker?.name || app.seeker?.email)?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={s.seekerName}>{app.seeker?.name || "Unnamed"}</p>
              <p style={s.seekerEmail}>{app.seeker?.email}</p>
              <p style={s.appliedAt}>
                Applied {new Date(app.applied_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Cover note */}
          {app.cover_note && <p style={s.coverNote}>"{app.cover_note}"</p>}

          {/* Actions row */}
          <div style={s.actions}>
            {/* Status badge + dropdown */}
            <div style={s.statusWrap}>
              <span
                style={{
                  ...s.statusBadge,
                  background: STATUS_COLORS[app.status]?.bg,
                  color: STATUS_COLORS[app.status]?.color,
                }}
              >
                {app.status}
              </span>
              <select
                style={s.select}
                value={app.status}
                disabled={updating === app.id}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlist</option>
                <option value="rejected">Reject</option>
                <option value="hired">Hire</option>
              </select>
              {updating === app.id && <span style={s.saving}>saving...</span>}
            </div>

            {/* Resume download */}
            {app.resume_url && (
              <button
                style={s.dlBtn}
                onClick={() => handleDownload(app.id, app.seeker?.name)}
              >
                ↓ Resume
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  title: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "2px",
  },
  sub: { fontSize: "12px", color: "#9ca3af", marginBottom: "1rem" },
  muted: {
    fontSize: "13px",
    color: "#9ca3af",
    textAlign: "center",
    padding: "2rem",
  },
  appRow: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  seekerInfo: { display: "flex", gap: "10px", alignItems: "flex-start" },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
    flexShrink: 0,
  },
  seekerName: { fontSize: "13px", fontWeight: "500", color: "#111" },
  seekerEmail: { fontSize: "12px", color: "#6b7280" },
  appliedAt: { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
  coverNote: {
    fontSize: "12px",
    color: "#374151",
    fontStyle: "italic",
    background: "#f9fafb",
    padding: "8px 10px",
    borderRadius: "6px",
    borderLeft: "3px solid #e5e7eb",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  statusWrap: { display: "flex", alignItems: "center", gap: "8px" },
  statusBadge: {
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  select: {
    fontSize: "12px",
    padding: "4px 8px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    background: "#fff",
    color: "#374151",
  },
  saving: { fontSize: "11px", color: "#9ca3af", fontStyle: "italic" },
  dlBtn: {
    padding: "5px 12px",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#374151",
    cursor: "pointer",
  },
};
