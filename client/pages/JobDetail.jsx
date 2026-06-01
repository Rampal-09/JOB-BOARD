import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { fetchJobById } from "../api/job";
import ApplyModal from "../components/ApplyModal.jsx";

const JobDetail = () => {
  const [job, setJob] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobById(id)
      .then((data) => setJob(data.job))
      .catch((err) => err.message)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={s.center}>Loading...</div>;
  if (!job) return <div style={s.center}>Job not found</div>;
  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>{job.title}</h1>
            <p style={s.company}>
              {job.recruiter?.name || job.recruiter?.email}
            </p>
          </div>
          {user?.role === "seeker" && (
            <button
              style={applied ? s.appliedBtn : s.applyBtn}
              onClick={() => !applied && setShowModal(true)}
            >
              {applied ? "✓ Applied" : "Apply Now"}
            </button>
          )}
        </div>
        {/* Meta tags */}
        <div style={s.meta}>
          {job.location && <span style={s.tag}>📍 {job.location}</span>}
          {job.type && <span style={s.tag}>💼 {job.type}</span>}
          {(job.salary_min || job.salary_max) && (
            <span style={{ ...s.tag, color: "#059669", background: "#ecfdf5" }}>
              💰 ₹{job.salary_min?.toLocaleString()} – ₹
              {job.salary_max?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div>
            <p style={s.sectionTitle}>Skills required</p>
            <div style={s.skills}>
              {job.skills.map((s) => (
                <span key={s} style={s.skill}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Description */}
        <div>
          <p style={s.sectionTitle}>About this role</p>
          <p style={s.description}>{job.description}</p>
        </div>

        {/* Login prompt for guests */}
        {!user && (
          <p style={s.loginPrompt}>
            <a href="/login">Login as job seeker</a> to apply
          </p>
        )}
      </div>

      {/* Apply modal */}
      {showModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setApplied(true);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default JobDetail;

const s = {
  page: { maxWidth: "720px", margin: "0 auto", padding: "2rem 1rem" },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "2rem",
    boxShadow: "0 1px 8px #0001",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },
  title: { fontSize: "1.4rem", fontWeight: "700", color: "#111" },
  company: { fontSize: "14px", color: "#6b7280", marginTop: "4px" },
  applyBtn: {
    padding: "10px 24px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  appliedBtn: {
    padding: "10px 24px",
    background: "#ecfdf5",
    color: "#059669",
    border: "1px solid #6ee7b7",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  meta: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tag: {
    fontSize: "13px",
    background: "#f3f4f6",
    padding: "5px 10px",
    borderRadius: "20px",
    color: "#374151",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  skills: { display: "flex", gap: "6px", flexWrap: "wrap" },
  skill: {
    fontSize: "12px",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "4px 10px",
    borderRadius: "4px",
  },
  description: { fontSize: "14px", color: "#374151", lineHeight: "1.7" },
  loginPrompt: { fontSize: "13px", color: "#6b7280", textAlign: "center" },
  center: { textAlign: "center", padding: "3rem", color: "#6b7280" },
};
