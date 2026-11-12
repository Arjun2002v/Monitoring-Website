import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "./paths";

/** Keeps signed-in users away from login/register. */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={PATHS.dashboard} replace /> : <Outlet />;
}
