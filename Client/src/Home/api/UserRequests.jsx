import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUser = (id, currentUserId = null) => {
  const params = currentUserId ? { userId: currentUserId } : {};
  return API.get(`/user/${id}`, { params });
};
export const updateUser = (id, formData) => API.put(`/user/${id}`, formData);
export const getAllUser = (userId) => {
  const params = userId ? { userId } : {};
  return API.get('/user', { params });
};
export const followUser = (id, data) => API.post(`/user/${id}/follow`, data);
export const unfollowUser = (id, data) => API.delete(`/user/${id}/follow`, { data });