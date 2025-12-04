import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ThemeProvider from "./theme";

import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

import Homepage from "./pages/private/home";
import ProfilePage from "./pages/private/profile";

import PublicLayout from "./layouts/public-layout";
import PrivateLayout from "./layouts/private-layout";

import EventsPage from "./pages/private/admin/events";
import CreateEvenetPage from "./pages/private/admin/events/create";
import EditEventPage from "./pages/private/admin/events/edit";

import EventInfoPage from "./pages/private/event";

import UserBookingsPage from "./pages/private/profile/bookings";
import AdminBookingsPage from "./pages/private/admin/bookings";

import UsersPage from "./pages/private/admin/users";
import AdminReports from "./pages/private/admin/reports";
import UserReports from "./pages/private/profile/reports/page";

import OfflinePage from "./pages/offline";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

function App() {
  const isOnline = useOnlineStatus();
  const [token] = useState(localStorage.getItem("token"));

  // sin internet y NO hay token → no mostrar nada privado
  if (!isOnline && !token) {
    return <OfflinePage />;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />

          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />

          {/* ---------- PRIVATE ROUTES ---------- */}

          {/* Home */}
          <Route
            path="/"
            element={
              isOnline ? (
                <PrivateLayout>
                  <Homepage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          {/* Perfil (USA CACHÉ → se permite offline) */}
          <Route
            path="/profile"
            element={
              <PrivateLayout>
                <ProfilePage />
              </PrivateLayout>
            }
          />

          {/* Bookings usuario → necesita backend */}
          <Route
            path="/profile/bookings"
            element={
              isOnline ? (
                <PrivateLayout>
                  <UserBookingsPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          {/* Reportes usuario → necesita backend */}
          <Route
            path="/profile/reports"
            element={
              isOnline ? (
                <PrivateLayout>
                  <UserReports />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          {/* Evento → necesita backend */}
          <Route
            path="/event/:id"
            element={
              isOnline ? (
                <PrivateLayout>
                  <EventInfoPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          {/* ---------- ADMIN ---------- */}

          <Route
            path="/admin/events"
            element={
              isOnline ? (
                <PrivateLayout>
                  <EventsPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          <Route
            path="/admin/events/create"
            element={
              isOnline ? (
                <PrivateLayout>
                  <CreateEvenetPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          <Route
            path="/admin/events/edit/:id"
            element={
              isOnline ? (
                <PrivateLayout>
                  <EditEventPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          <Route
            path="/admin/bookings"
            element={
              isOnline ? (
                <PrivateLayout>
                  <AdminBookingsPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          <Route
            path="/admin/users"
            element={
              isOnline ? (
                <PrivateLayout>
                  <UsersPage />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          {/* Reportes admin → también requiere backend */}
          <Route
            path="/admin/reports"
            element={
              isOnline ? (
                <PrivateLayout>
                  <AdminReports />
                </PrivateLayout>
              ) : (
                <OfflinePage />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<OfflinePage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
