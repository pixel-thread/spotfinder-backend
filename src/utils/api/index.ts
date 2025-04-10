import { env } from "@/env";
import { AUTH_TOKEN_KEY } from "@/lib/constants/token";
import axios from "axios";
import { Cookies } from "react-cookie";

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const cookies = new Cookies();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get(AUTH_TOKEN_KEY);
    if (token && !config.headers["Authorization"]) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration or invalid token
      cookies.remove(AUTH_TOKEN_KEY);
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
