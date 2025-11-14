import axiosInstance from "../axiosConfig";

// Register
export const registerUser = async (data: any) => {
  const response = await axiosInstance.post("/api/users/register", data);
  return response.data;
};

// Login
export const loginUser = async (data: any) => {
  const response = await axiosInstance.post("/api/users/login", data);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/api/users/current-user");
  return response.data;
};

// Get all users
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/users/get-all-users");
  return response.data;
};

// Update user
export const updateUserData = async (data: any) => {
  const response = await axiosInstance.put("/api/users/update-user", data);
  return response.data;
};
