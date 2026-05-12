import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { AppLayout } from "./components/layout/AppLayout"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { ReservationListPage } from "./pages/ReservationListPage"
import { ReservationFormPage } from "./pages/ReservationFormPage"

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/reservations" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reservations" element={<ReservationListPage />} />
          <Route path="/reservations/new" element={<ReservationFormPage />} />
          <Route path="/reservations/:id/edit" element={<ReservationFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
