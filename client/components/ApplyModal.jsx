import { useState } from "react";

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!file) return setError("Please attach your resume");

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("coverNote", coverNote);
    formData.append("jobId", job.id);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/upload/resume", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // Do NOT set Content-Type — browser sets multipart/form-data boundary
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <textarea
        placeholder="Cover note (optional)"
        value={coverNote}
        onChange={(e) => setCoverNote(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Submit application"}
      </button>
    </div>
  );
};

export default ApplyModal;
