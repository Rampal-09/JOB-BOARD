import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("seeker");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      return setError("Enter your email");
      setLoading(false);
      setError("");
    }
    try {
      await sendOtp(email, role);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!otp) return setError("Enter the OTP from your email");
    setLoading(false);
    setError("");
    try {
      const data = await verifyOtp(email, otp);
      Login(data.token, data.user);
      Navigate(data.user.role === "recruiter" ? "/recruiter" : "/dashboards");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pages}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {step === "email" ? "Sign in to Job Board" : "Enter your OTP"}
        </h2>
        {step === "email" ? (
          <>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={styles.roleRow}>
              {["seeker", "recruiter"].map((r) => (
                <button
                  key={r}
                  style={role === r ? styles.roleActive : styles.roleBtn}
                  onClick={() => setRole(r)}
                >
                  {r === "seeker" ? "job Seeker" : "Recruiter"}
                </button>
              ))}
              <button style={styles.btn} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={styles.hint}>code send to {email}</p>
            <input
              type="text"
              style={styles.input}
              placeholder="6-digit code"
              maxLength={6}
              value={otp}
              onChange={() => setOtp(e.target.value)}
            />
            <button style={styles.btn} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button style={styles.back} onClick={() => setStep("email")}>
              ← Back
            </button>
          </>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 4px 24px #0001",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: "#111",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "1rem",
    outline: "none",
  },
  roleRow: { display: "flex", gap: "8px", marginBottom: "1rem" },
  roleBtn: {
    flex: 1,
    padding: "8px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "13px",
    color: "#6b7280",
  },
  roleActive: {
    flex: 1,
    padding: "8px",
    border: "1px solid #6366f1",
    borderRadius: "8px",
    background: "#eef2ff",
    fontSize: "13px",
    color: "#4338ca",
    fontWeight: "500",
  },
  btn: {
    width: "100%",
    padding: "11px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
  hint: { fontSize: "13px", color: "#6b7280", marginBottom: "1rem" },
  back: {
    marginTop: "0.75rem",
    width: "100%",
    padding: "8px",
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: "13px",
  },
  error: { marginTop: "0.75rem", color: "#ef4444", fontSize: "13px" },
};
