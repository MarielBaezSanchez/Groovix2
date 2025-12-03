import { useEffect, useState } from "react";

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export const saveEventsCacheToLocalStorage = (events: any[]) => {
  try {
    localStorage.setItem("offline_events", JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events to localStorage:", error);
  }
};

export const saveReportsCacheToLocalStorage = (reports: any) => {
  try {
    localStorage.setItem("offline_reports", JSON.stringify(reports));
  } catch (error) {
    console.error("Error saving reports to localStorage:", error);
  }
};

export const getEventsCacheFromLocalStorage = (): any[] => {
  try {
    const cached = localStorage.getItem("offline_events");
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error("Error getting events from localStorage:", error);
    return [];
  }
};

export const getReportsCacheFromLocalStorage = (): any => {
  try {
    const cached = localStorage.getItem("offline_reports");
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error("Error getting reports from localStorage:", error);
    return {};
  }
};

