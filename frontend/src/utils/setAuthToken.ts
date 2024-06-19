import axios from "axios";

export const setAuthToken = (token: string) => {
  if (!token) {
    delete axios.defaults.headers.common["access"];
    sessionStorage.removeItem("token");
    return;
  }

  axios.defaults.headers.common["access"] = token;
  sessionStorage.setItem("token", token);
};
