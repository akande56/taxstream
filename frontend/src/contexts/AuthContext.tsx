/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// interface AuthContextType {
//   user: { role: string } | null;
//   login: (role: string) => void;
//   logout: () => void;
// }
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<{ role: string }>({ role: "admin" });
//   const login = () => {
//     setUser({ role: "admin" });
//     navigate("/dashboard");
//   };
//   const logout = () => {
//     setUser({ role: "" });
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
// src/contexts/AuthContext.tsximport axios from "axios";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
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
}

const initialAuthState: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
};

type Props = {
  children?: ReactNode;
};

// const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const BACKEND_URL = "https://taxstream-3bf552628416.herokuapp.com";

const AuthContext = createContext<AuthContextType>(initialAuthState);

export const AuthProvider = ({ children }: Props) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUser = async (authData: AuthTokens) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/me/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access}`,
        },
      });

      if (response.status === 200) {
        const { data } = response;
        setUser({
          id: data.id,
          username: data.username,
          role: data.user_role,
          email: data.email,
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/token/`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { data } = response;
        toast.success("Login Successful");
        setAuthTokens(data);
        await getUser(data);
        localStorage.setItem("authTokens", JSON.stringify(data));
        // Check if there is a stored location to redirect to
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          // Redirect to the stored location
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Login Failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Login Failed: ${error?.message}`);
    }
  };

  const logout = () => {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  const updateToken = async () => {
    try {
      const localAuthTokens = localStorage.getItem("authTokens");
      if (!localAuthTokens) {
        console.log("No auth tokens found, logging out");
        logout();
        return;
      }

      const parsedAuthTokens = JSON.parse(localAuthTokens);
      console.log("parsedAuth", parsedAuthTokens);
      if (!parsedAuthTokens?.refresh) {
        console.log("No refresh token found, logging out");
        logout();
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/token/refresh/`,
        { refresh: JSON.stringify(parsedAuthTokens.refresh) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedAuthTokens.access}`,
          },
        }
      );

      if (response.status === 200) {
        const { data } = response;
        setAuthTokens(data);
        await getUser(data);
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        console.warn("Token refresh response not 200, logging out");
        logout();
      }
    } catch (error) {
      console.error("Failed to update token:", error);
      logout();
    } finally {
      setLoading(false);
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
    <AuthContext.Provider value={{ user, login, logout }}>
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
