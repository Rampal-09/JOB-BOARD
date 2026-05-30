import { useEffect, useMemo, useReducer, useState } from "react";
import {
  applyFilter,
  filterReducer,
  initialState,
} from "../reducers/filterReducer.js";

import { fetchJobs } from "../api/jobs";
import { JobCard } from "../components/JobCard";

const Browse = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, dispatch] = useReducer(filterReducer, initialState);

  useEffect(() => {
    fetchJobs()
      .then((data) => setAllJobs(data.jobs))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    return applyFilter(allJobs, filters);
  }, [allJobs, filters]);

  if (loading) return <div style={s.center}>Loading jobs...</div>;
  if (error) return <div style={s.center}>Error: {error}</div>;

  return (
    <div style={s.page}>
      <div style={s.filterBar}>
        <input
          type="text"
          placeholder="Search title or skill..."
          value={filters.keyword}
          onChange={(e) =>
            dispatch({ type: "SET_KEYWORD", payload: e.target.value })
          }
        />
        <input
          style={s.input}
          placeholder="Location"
          value={filters.location}
          onChange={(e) =>
            dispatch({ type: "SET_LOCATION", payload: e.target.value })
          }
        />

        {/* Job type toggle buttons */}
        <div style={s.typeRow}>
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              style={filters.type === t ? s.typeActive : s.typeBtn}
              onClick={() => dispatch({ type: "SET_TYPE", payload: t })}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          style={s.input}
          value={filters.sortBy}
          onChange={(e) =>
            dispatch({ type: "SET_SORT", payload: e.target.value })
          }
        >
          <option value="newest">Newest first</option>
          <option value="salary_high">Salary: High to Low</option>
          <option value="salary_low">Salary: Low to High</option>
        </select>

        <button style={s.resetBtn} onClick={() => dispatch({ type: "RESET" })}>
          Clear filters
        </button>
        <p style={s.count}>
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
        </p>

        {/* ── Job grid ── */}
        {filteredJobs.length === 0 ? (
          <div style={s.center}>No jobs match your filters</div>
        ) : (
          <div style={s.grid}>
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;

const s = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "1.5rem",
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 1px 4px #0001",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    minWidth: "160px",
  },
  typeRow: { display: "flex", gap: "6px", flexWrap: "wrap" },
  typeBtn: {
    padding: "6px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    background: "#fff",
    fontSize: "12px",
    color: "#6b7280",
  },
  typeActive: {
    padding: "6px 12px",
    border: "1px solid #6366f1",
    borderRadius: "20px",
    background: "#eef2ff",
    fontSize: "12px",
    color: "#4338ca",
    fontWeight: "500",
  },
  resetBtn: {
    padding: "6px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "12px",
    color: "#6b7280",
  },
  count: { fontSize: "13px", color: "#6b7280", marginBottom: "1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  center: { textAlign: "center", padding: "3rem", color: "#6b7280" },
};
