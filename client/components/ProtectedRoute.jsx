import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const ProtectedRoute = ({ children, allowrole }) => {
  const nevigate = useNavigate();

  const { user } = useAuth();
  if (!user) return <Navigate to={"/login"} replace />;

  if (allowrole && user.role !== allowrole)
    return (
      <Navigate to={user.role === "recruiter" ? "/recruiter" : "/dashboard"} />
    );

  return children;
};

export default ProtectedRoute;
