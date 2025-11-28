import axiosInstance from "../axiosConfig";

// REGISTER
export const registerUser = async (data: any) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};

// LOGIN
export const loginUser = async (data: any) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/current-user");
  return response.data;
};

// GET ALL USERS
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users/get-all-users");
  return response.data;
};

// UPDATE USER
export const updateUserData = async (data: any) => {
  const response = await axiosInstance.put("/users/update-user", data);
  return response.data;
};

