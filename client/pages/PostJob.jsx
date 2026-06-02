import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createJob } from "../api/job";

const initialForm = {
  title: "",
  description: "",
  location: "",
  type: "full-time",
  min_salary: "",
  max_salary: "",
  skills: "",
};

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.location || !form.type) {
      setError("Title, description, location, and type are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      type: form.type,
      min_salary: form.min_salary ? Number(form.min_salary) : null,
      max_salary: form.max_salary ? Number(form.max_salary) : null,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);
      await createJob(payload);
      navigate("/recruiter");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.err || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.heading}>Post a Job</h1>
          <p style={s.sub}>Create a new listing for candidates to discover.</p>
        </div>
        <Link to="/recruiter" style={s.backLink}>
          Back to dashboard
        </Link>
      </div>

      <form style={s.form} onSubmit={handleSubmit}>
        <label style={s.label}>
          Job title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            style={s.input}
            placeholder="Frontend Developer"
          />
        </label>

        <label style={s.label}>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={s.textarea}
            placeholder="Describe the role, responsibilities, and requirements."
          />
        </label>

        <div style={s.row}>
          <label style={s.label}>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              style={s.input}
              placeholder="Remote"
            />
          </label>

          <label style={s.label}>
            Job type
            <select name="type" value={form.type} onChange={handleChange} style={s.input}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </label>
        </div>

        <div style={s.row}>
          <label style={s.label}>
            Minimum salary
            <input
              name="min_salary"
              type="number"
              min="0"
              value={form.min_salary}
              onChange={handleChange}
              style={s.input}
              placeholder="30000"
            />
          </label>

          <label style={s.label}>
            Maximum salary
            <input
              name="max_salary"
              type="number"
              min="0"
              value={form.max_salary}
              onChange={handleChange}
              style={s.input}
              placeholder="60000"
            />
          </label>
        </div>

        <label style={s.label}>
          Skills
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            style={s.input}
            placeholder="React, Node.js, SQL"
          />
        </label>

        {error && <p style={s.error}>{error}</p>}

        <div style={s.actions}>
          <Link to="/recruiter" style={s.cancel}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} style={s.submit}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

const s = {
  page: { maxWidth: "860px", margin: "0 auto", padding: "1.5rem 1rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  heading: { fontSize: "1.4rem", fontWeight: "700", color: "#111" },
  sub: { fontSize: "13px", color: "#6b7280", marginTop: "3px" },
  backLink: { color: "#4f46e5", fontSize: "13px", textDecoration: "none" },
  form: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "1rem",
    fontSize: "13px",
    fontWeight: "500",
    color: "#111",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
  },
  error: { color: "#ef4444", fontSize: "13px", marginBottom: "1rem" },
  actions: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  cancel: {
    padding: "10px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#6b7280",
    fontSize: "13px",
    textDecoration: "none",
  },
  submit: {
    padding: "10px 18px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
