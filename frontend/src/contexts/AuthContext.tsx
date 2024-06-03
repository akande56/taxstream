/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// // src/contexts/AuthContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from "react";
// interface AuthContextType {
//   user: { role: string } | null;
//   login: (role: string) => void;
//   logout: () => void;
// }
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<object>({ role: ["admin"] });
//   const login = () => {
//     setUser({ role: ["admin"] });
//   };
//   const logout = () => {
//     setUser({});
//   };
//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
// src/contexts/AuthContext.tsx
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  role: string;
  email: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  loginError: boolean;
  loginInfo: string;
}

const initialAuthState = {
  user: null,
  login: () => {},
  logout: () => {},
  loginError: false,
  loginInfo: "",
};
type Props = {
  children?: ReactNode;
};

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const AuthContext = createContext<AuthContextType>(initialAuthState);

export const AuthProvider = ({ children }: Props) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode<User>(JSON.parse(tokens).access) : null;
  });

  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [loginInfo, setLoginInfo] = useState("");

  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/token/`, {
        username,
        password,
      });

      const { data } = response;
      console.log(data);

      if (response.status === 200) {
        setLoginInfo("Login Successful");
        setAuthTokens(data);
        setUser({ role: "admin", ...data.user });
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setLoginError(true);
      }
    } catch (error: any) {
      console.error("An error occurred:", error);
      setLoginError(true);
      setLoginInfo(error?.message ?? "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    if (loading) {
      setLoading(false);
    }
    navigate("/login");
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logout();
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      const { data } = response;

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode<User>(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logout();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to update token:", error);
      logout();
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 60); // 60 minutes
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loginError, loginInfo }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
