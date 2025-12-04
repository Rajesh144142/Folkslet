import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: API_BASE_URL });
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
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

export const getTimelinePosts = (id) => API.get(`/post/timeline/${id}`);
export const likePost = async (id, userId) => {
  try {
    const response = await API.post(`/post/${id}/like`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const commentInthePost = async (id, data) => await API.post(`/post/${id}/comments`, data);
    
