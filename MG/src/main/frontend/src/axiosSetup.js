import { useNavigate } from 'react-router-dom';

import axios from 'axios';

/* REUSABLE AXIOS (BASE) INSTANCE */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080", // backend base URL
  headers: { "Content-Type": "application/json" }
});

/* REQUEST INTERCEPTOR */
// automatically attach token in every call header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.url.includes("/login") && !config.url.includes("/user")) {
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
      useNavigate("/"); // redirect to login page
    }
    return Promise.reject(err);
  }
);

export default api;