import { BrowserRouter, Routes, Route } from "react-router-dom";
// @ts-ignore
import { useEffect, useState } from "react";
import ThemeProvider from "./theme";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import Homepage from "./pages/private/home";
import HomeOfflineView from "./pages/private/home/offline-view";
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
import AdminReportsOfflineView from "./pages/private/admin/reports/offline-view";
import UserReports from "./pages/private/profile/reports/page";
import OfflinePage from "./pages/offline";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

function App() {
  const isOnline = useOnlineStatus();
  const [token] = useState(localStorage.getItem("token"));

  // Si no hay conexión y no hay token, mostrar página offline simple
  if (!isOnline && !token) {
    return <OfflinePage />;
  }
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
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
          <Route
            path="/"
            element={
              <PrivateLayout>
                {!isOnline ? <HomeOfflineView /> : <Homepage />}
              </PrivateLayout>
            }
          />

          <Route
            path="/event/:id"
            element={
              <PrivateLayout>
                <EventInfoPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateLayout>
                <ProfilePage />
              </PrivateLayout>
            }
          />

          <Route
            path="/profile/bookings"
            element={
              <PrivateLayout>
                <UserBookingsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/profile/reports"
            element={
              <PrivateLayout>
                <UserReports />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin/events"
            element={
              <PrivateLayout>
                <EventsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin/events/create"
            element={
              <PrivateLayout>
                <CreateEvenetPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin/events/edit/:id"
            element={
              <PrivateLayout>
                <EditEventPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <PrivateLayout>
                <AdminBookingsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin/users"
            element={
              <PrivateLayout>
                <UsersPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <PrivateLayout>
                {!isOnline ? <AdminReportsOfflineView /> : <AdminReports />}
              </PrivateLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
