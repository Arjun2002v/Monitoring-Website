import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "./paths";

/** Only lets signed-in users through; remembers where they were headed. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
