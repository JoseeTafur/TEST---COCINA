import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // El puerto de tu backend
});

// Este interceptor se ejecuta ANTES de cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // O donde guardes el JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;