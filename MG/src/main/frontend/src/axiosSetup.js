import axios from 'axios';
import { navigateTo } from './navigateService';

/* REUSABLE AXIOS (BASE) INSTANCE */
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" }
});

/* REQUEST INTERCEPTOR */
// automatically attach token in every call header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.url.includes("/login") && !config.url.includes("/user/exist") && !config.url.includes("/jwt/")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },  
  (error) => { return Promise.reject(error); }
);

/* RESPONSE INTERCEPTOR */
// globally handle expired or invalid tokens
api.interceptors.response.use(
  (res) => { return res; },
  (err) => {
    if (err.response && err.response.status === 401) {  // token expired or unauthorized
      console.warn("Token expired or invalid, logging user out...")
      console.log("Removing token: ", localStorage.getItem("token") || "none");
      localStorage.removeItem("token");
      navigateTo("/");  // redirect to login page
    }
    return Promise.reject(err);
  }
);

export default api;