import axiosInstance from "../axiosConfig";

// CREATE BOOKING
export const createBooking = async (data: any) => {
  const response = await axiosInstance.post("/bookings/create-booking", data);
  return response.data;
};

// GET BOOKINGS DEL USUARIO LOGUEADO
export const getUserBookings = async () => {
  const response = await axiosInstance.get("/bookings/get-user-bookings");
  return response.data;
};

// GET TODAS LAS RESERVAS (ADMIN)
export const getAllBookings = async () => {
  const response = await axiosInstance.get("/bookings/get-all-bookings");
  return response.data;
};

// CANCELAR RESERVA
export const cancelBooking = async (data: any) => {
  const response = await axiosInstance.post("/bookings/cancel-booking", data);
  return response.data;
};