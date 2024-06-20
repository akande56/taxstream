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
// import axios from "axios";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// interface User {
//   id: string;
//   username: string;
//   role: string;
//   email: string;
// }

// interface AuthTokens {
//   access: string;
//   refresh: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string) => void;
//   logout: () => void;
// }

// const initialAuthState: AuthContextType = {
//   user: null,
//   login: () => {},
//   logout: () => {},
// };

// type Props = {
//   children?: ReactNode;
// };

// // const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
// const BACKEND_URL = "https://taxstream-3bf552628416.herokuapp.com";

// const AuthContext = createContext<AuthContextType>(initialAuthState);

// export const AuthProvider = ({ children }: Props) => {
//   const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
//     const tokens = localStorage.getItem("authTokens");
//     return tokens ? JSON.parse(tokens) : null;
//   });

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const getUser = async (authData: AuthTokens) => {
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/v1/user/me/`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authData.access}`,
//         },
//       });

//       if (response.status === 200) {
//         const { data } = response;
//         setUser({
//           id: data.id,
//           username: data.username,
//           role: data.user_role,
//           email: data.email,
//         });
//       } else {
//         logout();
//       }
//     } catch (error) {
//       console.error("Failed to fetch user data:", error);
//       logout();
//     }
//   };

// const login = async (username: string, password: string) => {
//   try {
//     const response = await axios.post(`${BACKEND_URL}/api/token/`, {
//       username,
//       password,
//     });
//     console.log(response.status);
//     if (response.status == 200) {
//       const { data } = response;
//       toast.success("Login Successful");
//       setAuthTokens(data);
//       await getUser(data);
//       localStorage.setItem("authTokens", JSON.stringify(data));
//       // Check if there is a stored location to redirect to
//       const redirectPath = localStorage.getItem("redirectAfterLogin");
//       if (redirectPath) {
//         // Redirect to the stored location
//         localStorage.removeItem("redirectAfterLogin");
//         navigate(redirectPath);
//       } else {
//         navigate("/dashboard");
//       }
//     } else {
//       toast.error("Login Failed");
//     }
//   } catch (error: any) {
//     console.error("Login error:", error);
//     toast.error(`Login Failed: ${error?.message}`);
//   }
// };

//   const logout = () => {
//     localStorage.setItem("redirectAfterLogin", location.pathname);
//     localStorage.removeItem("authTokens");
//     setAuthTokens(null);
//     setUser(null);
//     setLoading(false);
//     navigate("/login");
//   };

//   const updateToken = async () => {
//     try {
//       const localAuthTokens = localStorage.getItem("authTokens");
//       if (!localAuthTokens) {
//         console.log("No auth tokens found, logging out");
//         logout();
//         return;
//       }

//       const parsedAuthTokens = JSON.parse(localAuthTokens);
//       console.log("parsedAuth", parsedAuthTokens);
//       console.log("location", location.pathname);
//       if (!parsedAuthTokens?.refresh) {
//         console.log("No refresh token found, logging out");
//         logout();
//         return;
//       }

//       const response = await axios.post(
//         `${BACKEND_URL}/api/token/refresh/`,
//         { refresh: parsedAuthTokens.refresh },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${parsedAuthTokens.access}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         const { data } = response;
//         setAuthTokens(data);
//         await getUser(data);
//         localStorage.setItem("authTokens", JSON.stringify(data));
//       } else {
//         console.warn("Token refresh response not 200, logging out");
//         logout();
//       }
//     } catch (error) {
//       console.error("Failed to update token:", error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       await updateToken();
//       setLoading(false);
//     };

//     if (loading) {
//       initializeAuth();
//     }
//     if (loading) {
//       updateToken();
//     }

//     const interval = setInterval(() => {
//       if (authTokens) {
//         updateToken();
//       }
//     }, 1000 * 60 * 60); // 60 minutes

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {!loading && children}
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

/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import axios from "axios";

// ** Types
import {
  AuthValuesType,
  LoginParams,
  RegisterParams,
  UserDataType,
} from "./types";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { setAuthToken } from "@/utils/setAuthToken";
import { createSearchParams, useNavigate } from "react-router-dom";
import { tokenToPayload } from "@/utils/tokenToPayload";
import { useApp } from "./AppContext";
import { toast } from "sonner";

// Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  setUser: () => null,
  editUser: () => Promise.resolve(),
  deleteUser: () => Promise.resolve(),
  loading: true,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  isInitialized: false,
  setIsInitialized: () => Boolean,
};
interface AuthContextType extends AuthValuesType {
  user: UserDataType | null;
  // login: (data: LoginParams) => void;
  // logout: () => void;
}
interface AuthTokens {
  access: string;
  refresh: string;
}

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};
const BACKEND_URL = "https://taxstream-3bf552628416.herokuapp.com";

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );

  const navigate = useNavigate();
  const { updateAppContext } = useApp();

  // If refreshed
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem("token");

      if (!storedToken) {
        sessionStorage.removeItem("token");
        setIsInitialized(false);
        navigate("/login", { replace: true });
        setLoading(false);
        return;
      }

      const isExpired = isTokenExpired(storedToken);

      if (isExpired) {
        sessionStorage.removeItem("token");
        setIsInitialized(false);
        navigate("/login", { replace: true });
        setLoading(false);
        return;
      }

      setAuthToken(storedToken);
      setIsInitialized(true);

      if (!user) {
        await getUser({ access: storedToken, refresh: "" });
      }

      const protectedRoutes = ["/dashboard"];
      const authRoutes = ["/login", "/register", "/verify"];

      protectedRoutes.forEach((route) => {
        if (location.pathname.startsWith(route) && !storedToken) {
          toast.info("Please sign in");
          navigate(
            {
              pathname: "/login",
              search: createSearchParams({
                returnUrl: location.pathname,
              }).toString(),
            },
            { replace: true }
          );
        }
      });

      authRoutes.forEach((route) => {
        if (location.pathname === route && storedToken) {
          toast.info("Already signed in");
          navigate("/dashboard");
        }
      });

      setLoading(false);
    };

    initializeAuth();
  }, [navigate]);

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
        const userData = {
          id: data.id,
          username: data.username,
          role: data.user_role,
          email: data.email,
        };
        setUser(userData);
        updateAppContext({ user: userData });
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      handleLogout();
    }
  };

  // const handleLogin = async ({ username, password }: LoginParams) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(
  //       `${BACKEND_URL}/api/token/`,
  //       {
  //         username,
  //         password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       }
  //     );
  //     console.log(response.status);
  //     if (response.status == 200) {
  //       const { data } = response;
  //       toast.success("Login Successful");
  //       // setAuthTokens(data);
  //       await getUser(data);
  //       localStorage.setItem("authTokens", JSON.stringify(data));
  //       // Check if there is a stored location to redirect to
  //       const redirectPath = localStorage.getItem("redirectAfterLogin");
  //       if (redirectPath) {
  //         // Redirect to the stored location
  //         localStorage.removeItem("redirectAfterLogin");
  //         navigate(redirectPath);
  //       } else {
  //         navigate("/dashboard");
  //       }
  //     } else {
  //       toast.error("Login Failed");
  //     }
  //   } catch (error: any) {
  //     console.error("Login error:", error);
  //     toast.error(`Login Failed: ${error?.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (params: LoginParams) => {
    try {
      const { username, password } = params;
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/token/`, {
        username,
        password,
      });

      const { access, refresh } = res.data;

      sessionStorage.setItem("token", access);
      sessionStorage.setItem("refresh", refresh);

      // convert token to payload (data)
      // const userData = tokenToPayload(access);
      await getUser({ access, refresh });

      // setUser({ ...userData });
      // updateAppContext({ user: { ...userData } });

      setIsInitialized(true);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // clear token from local storage
      sessionStorage.removeItem("token");
      setUser(null);
      setIsInitialized(false);
      navigate(
        {
          pathname: "/login",
        },
        { replace: true }
      );

      toast.error("logout successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await axios.delete(
        `${process.env.VITE_SERVER_HOST}/endpoint/${id}`
      );
      setUser(null);
      setIsInitialized(false);
      console.log(res.data);

      // other logics comes here
    } catch (error) {
      console.error("error deleting profile", error);
    } finally {
      setLoading(false);
    }
  };

  // TODO replace any type with actual schema
  const handleEditUser = async (id: string, data: any) => {
    try {
      const res = await axios.patch(
        `${process.env.VITE_SERVER_HOST}/something/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      setUser({ ...res.data });
      updateAppContext({ user: { ...res.data } });

      sessionStorage.setItem("userData", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error occur editing user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (params: RegisterParams) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.VITE_SERVER_HOST}/something`,
        params
      );

      const { access, refresh } = res.data;

      sessionStorage.setItem("token", access);
      sessionStorage.setItem("refresh", refresh);

      // convert token to payload (data)
      const userData = tokenToPayload(access);

      setUser(userData);
      updateAppContext({ user: userData });

      setIsInitialized(true);

      // Other Logics come here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const values = {
    user,
    setUser,
    loading,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    editUser: handleEditUser,
    deleteUser: handleDeleteUser,
    isInitialized,
    setIsInitialized,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider };
