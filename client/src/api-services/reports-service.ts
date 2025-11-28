import axiosInstance from "../axiosConfig";

// REPORTES ADMIN
export const getAdminReports = async (data: any) => {
  const response = await axiosInstance.post("/reports/get-admin-reports", data);
  return response.data;
};

// REPORTES DEL USUARIO
export const getUserReports = async () => {
  const response = await axiosInstance.get("/reports/get-user-reports");
  return response.data;
};
