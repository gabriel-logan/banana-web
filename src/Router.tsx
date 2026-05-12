import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";

import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ReservationFormPage } from "./pages/ReservationFormPage";
import { ReservationListPage } from "./pages/ReservationListPage";
import { useAuthStore } from "./stores/auth.store";

function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicOnly() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/reservations" replace />;
  }

  return <Outlet />;
}

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/reservations" replace />} />
            <Route path="/reservations" element={<ReservationListPage />} />
            <Route path="/reservations/new" element={<ReservationFormPage />} />
            <Route
              path="/reservations/:id/edit"
              element={<ReservationFormPage />}
            />
          </Route>
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/reservations" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
