import { env } from '@/env';
import { AUTH_TOKEN_KEY } from '@/lib/constants/token';
import axios, { AxiosError } from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        cookies.remove(AUTH_TOKEN_KEY);
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
