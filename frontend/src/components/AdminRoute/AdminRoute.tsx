import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24, textAlign: "center" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only ADMIN and MODERATOR can access admin panel
  if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
