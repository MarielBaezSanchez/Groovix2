import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export function useOfflineRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está offline al abrir la página, redirige
    if (!navigator.onLine) {
      navigate("/offline");
      return;
    }

    const handleOffline = () => {
      navigate("/offline");
    };

    const handleOnline = () => {
      message.success("Conexión restaurada");
      // si quieres recargar datos al volver online, lo haces fuera del hook
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);
}
