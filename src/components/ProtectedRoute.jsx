import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppLayout from "./AppLayout";
import LoadingScreen from "./LoadingScreen";

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/linhas" replace />;

  return <AppLayout>{children}</AppLayout>;
}