import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://server-e7g2.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;