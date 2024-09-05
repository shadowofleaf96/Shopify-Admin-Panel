import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AxiosConfig = axios.create({
  baseURL: `${backendUrl}/api`,
});

AxiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosConfig;