import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080",
//  withCredentials: true // if use cookies/session
});

export default api;