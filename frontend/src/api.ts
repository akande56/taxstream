import axios from "axios";
import { isTokenExpired } from "./utils/isTokenExpired";
import { toast } from "sonner";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://taxstream-3bf552628416.herokuapp.com",
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set the Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    const storedToken = sessionStorage.getItem("token");
    const isExpired = isTokenExpired(storedToken || "");
    if (isExpired) {
      sessionStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
    }
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
