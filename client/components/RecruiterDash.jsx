import { useAuth } from "../context/AuthContext";

export default function RecruiterDash() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Recruiter Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
