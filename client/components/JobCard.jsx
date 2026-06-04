import { useNavigate } from "react-router-dom";

const JobCard = ({
  job,
  canSave = false,
  isSaved = false,
  onToggleSave,
  saving = false,
}) => {
  const navigate = useNavigate();

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not disclosed";
    if (!max) return `₹${min.toLocaleString()}+`;
    return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
  };

  const timeAgo = (dateStr) => {
    const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div>
          <h3 style={s.title}>{job.title}</h3>
          <p style={s.company}>{job.recruiter?.name || job.recruiter?.email}</p>
        </div>
        {canSave && (
          <button
            type="button"
            style={isSaved ? s.saveBtnActive : s.saveBtn}
            onClick={() => onToggleSave?.(job.id, isSaved)}
            disabled={saving}
            title={isSaved ? "Unsave job" : "Save job"}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? "★" : "☆"}
          </button>
        )}
      </div>

      <div style={s.meta}>
        {job.location && <span style={s.tag}>📍 {job.location}</span>}
        {job.type && <span style={s.tag}>{job.type}</span>}
      </div>

      <p style={s.salary}>{formatSalary(job.min_salary, job.max_salary)}</p>

      {job.skills?.length > 0 && (
        <div style={s.skills}>
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} style={s.skill}>
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span style={s.skill}>+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      <div style={s.footer}>
        <span style={s.date}>{timeAgo(job.created_at)}</span>
        <button style={s.viewBtn} onClick={() => navigate(`/jobs/${job.id}`)}>
          View Job →
        </button>
      </div>
    </div>
  );
};

export default JobCard;

const s = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "box-shadow .15s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "3px",
  },
  company: { fontSize: "13px", color: "#6b7280" },
  saveBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#9ca3af",
    padding: "0",
    cursor: "pointer",
    lineHeight: 1,
  },
  saveBtnActive: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#f59e0b",
    padding: "0",
    cursor: "pointer",
    lineHeight: 1,
  },
  meta: { display: "flex", gap: "6px", flexWrap: "wrap" },
  tag: {
    fontSize: "12px",
    background: "#f3f4f6",
    padding: "3px 8px",
    borderRadius: "20px",
    color: "#374151",
  },
  salary: { fontSize: "13px", fontWeight: "500", color: "#059669" },
  skills: { display: "flex", gap: "5px", flexWrap: "wrap" },
  skill: {
    fontSize: "11px",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: "8px",
    borderTop: "1px solid #f3f4f6",
  },
  date: { fontSize: "12px", color: "#9ca3af" },
  viewBtn: {
    fontSize: "13px",
    color: "#4f46e5",
    background: "none",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
  },
};
