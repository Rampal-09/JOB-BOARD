import { useAuth } from "../context/Authcontext";

const SeekerDash = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.email}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default SeekerDash;
