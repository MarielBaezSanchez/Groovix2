import axiosInstance from "../axiosConfig";

// OBTENER CLIENT SECRET PARA STRIPE
export const getClientSecret = async (amount: number) => {
  const response = await axiosInstance.post("/payments/create-payment-intent", {
    amount,
  });
  return response.data;
};
