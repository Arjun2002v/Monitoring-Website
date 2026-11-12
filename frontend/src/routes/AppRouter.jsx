import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MarketingLayout } from "../layouts/MarketingLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { PATHS } from "./paths";

// Pages are code-split so the landing page doesn't ship dashboard code.
const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const MonitorDetailPage = lazy(() => import("../pages/MonitorDetailPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path={PATHS.home} element={<LandingPage />} />
          </Route>

          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path={PATHS.login} element={<LoginPage />} />
              <Route path={PATHS.register} element={<RegisterPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={PATHS.dashboard} element={<DashboardPage />} />
              <Route path={PATHS.monitor()} element={<MonitorDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
