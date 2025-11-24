import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://groovixev.vercel.app/",
  withCredentials: true,
});

export default axiosInstance;
