import { env } from '@/env';
import axios from 'axios';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();
const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default axiosInstance;
