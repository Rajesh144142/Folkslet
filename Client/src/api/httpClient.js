import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 20000,
});

httpClient.interceptors.request.use((config) => {
  const storedProfile = localStorage.getItem('profile');
  if (storedProfile) {
    try {
      const { token } = JSON.parse(storedProfile);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem('profile');
    }
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';
    const normalizedError = new Error(message);
    normalizedError.response = error?.response;
    normalizedError.status = error?.response?.status;
    return Promise.reject(normalizedError);
  },
);

export default httpClient;

