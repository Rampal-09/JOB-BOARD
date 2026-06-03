import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const ProtectedRoute = ({ children, allowRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!user) return <Navigate to={"/login"} replace />;

  if (allowRole && user.role !== allowRole)
    return (
      <Navigate to={user.role === "recruiter" ? "/recruiter" : "/dashboard"} />
    );

  return children;
};

export default ProtectedRoute;
