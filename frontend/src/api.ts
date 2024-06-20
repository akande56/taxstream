// import axios from "axios";

// const storedToken = sessionStorage.getItem("token");
// console.log(storedToken, "Stored Token");
// // Create an Axios instance
// const api = axios.create({
//   baseURL: "https://taxstream-3bf552628416.herokuapp.com",
//   timeout: 15000, // Increased timeout to 15 seconds

//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${storedToken}`,
//   },
// });

// export default api;

import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://taxstream-3bf552628416.herokuapp.com",
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set the Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
