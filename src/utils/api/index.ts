import { AUTH_TOKEN_KEY } from "@/lib/constants/token";
import axios from "axios";
import { Cookies } from "react-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

const cookies = new Cookies();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get(AUTH_TOKEN_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
