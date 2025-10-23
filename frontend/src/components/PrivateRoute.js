import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e50000] mr-3"></div>
        <span>Chargement de la session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
