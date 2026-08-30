import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Role } from "../types";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;