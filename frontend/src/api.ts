import axios from "axios";

// Retrieve authToken from localStorage
// const authToken = localStorage.getItem("authToken");
// const token = authToken ? JSON.parse(authToken) : null;
// const authTokens = JSON.parse(localStorage.getItem("authTokens") || "");
// const authTokens = localStorage.getItem("authTokens")
//   ? JSON.parse(localStorage.getItem("authTokens") || "{}")
//   : null;
const storedToken = sessionStorage.getItem("token");
// Create an Axios instance
const api = axios.create({
  baseURL: "https://taxstream-3bf552628416.herokuapp.com",
  timeout: 15000, // Increased timeout to 15 seconds

  // If a token exists, add it to the headers
  // headers: {
  //   "Content-Type": "application/json",
  // },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Access: storedToken,
    Authorization: `Bearer ${storedToken}`,
  },
});

// Add a request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Retrieve the token from local storage
//     const authToken = localStorage.getItem("authToken");
//     const token = authToken ? JSON.parse(authToken) : null;

//     if (token) {
//       // If a token exists, add it to the headers
//       config.headers.Authorization = `Bearer ${token.access}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Optional: Add a response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors
//     if (error.response && error.response.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
