import axios from "axios";

// Create an Axios instance with the base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: API_BASE_URL });

// Add an interceptor to attach the user's token to requests
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

export const uploadImage = (data) => {
  return API.post("/upload", data);
};

export const uploadPost = (data) => {
  return API.post("/post", data);
};

// Export the API instance for usage in other parts of the application
export default API;
