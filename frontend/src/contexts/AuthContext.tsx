/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
interface AuthContextType {
  user: { role: string } | null;
  login: (role: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ role: string }>({ role: "admin" });
  const login = () => {
    setUser({ role: "admin" });
    navigate("/dashboard");
  };
  const logout = () => {
    setUser({ role: "" });
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
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
// src/contexts/AuthContext.tsx
// import axios from "axios";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "sonner";

// interface User {
//   id: string;
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

// const initialAuthState = {
//   user: null,
//   login: () => {},
//   logout: () => {},
//   loginError: false,
//   loginInfo: "",
// };
// type Props = {
//   children?: ReactNode;
// };

// const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

// const AuthContext = createContext<AuthContextType>(initialAuthState);

// export const AuthProvider = ({ children }: Props) => {
//   const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
//     const tokens = localStorage.getItem("authTokens");
//     console.log("tokens", tokens);
//     return tokens ? JSON.parse(tokens) : null;
//   });

//   const [user, setUser] = useState<User | null>(() => {
//     const tokens = localStorage.getItem("authTokens");
//     return tokens ? jwtDecode<User>(JSON.parse(tokens).access) : null;
//   });

//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // const setAuthUser = (tokens: AuthTokens) => {};

//   const login = async (username: string, password: string) => {
//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/token/`, {
//         username,
//         password,
//       });

//       const { data } = response;
//       console.log(data);

//       if (response.status === 200) {
//         toast.success("Login Successful");
//         setAuthTokens(data);
//         setUser({ role: "admin", ...data.user });
//         localStorage.setItem("authTokens", JSON.stringify(data));
//         navigate("/dashboard");
//       } else {
//         toast.error("Login Failed");
//       }
//     } catch (error: any) {
//       console.error("An error occurred:", error);
//       toast.error(`Login Failed ${error?.message}`);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("authTokens");
//     setAuthTokens(null);
//     setUser(null);
//     if (loading) {
//       setLoading(false);
//     }
//     navigate("/login");
//   };

//   // const updateToken = async () => {
//   //   const localAuthTokens = localStorage.getItem("authTokens");
//   //   const parsedAuthTokens = localAuthTokens
//   //     ? JSON.parse(localAuthTokens)
//   //     : null;
//   //   console.log("parsedAuthTokens", parsedAuthTokens);
//   //   if (!parsedAuthTokens?.refresh) {
//   //     console.log("No refresh token found, logging out");
//   //     logout();
//   //     return;
//   //   }

//   //   try {
//   //     console.log("Updating token");

//   //     const response = await axios.post(
//   //       `${BACKEND_URL}/api/token/refresh/`,
//   //       { refresh: parsedAuthTokens.refresh },

//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${parsedAuthTokens.access}`,
//   //         },
//   //       }
//   //     );

//   //     if (response.status === 200) {
//   //       const { data } = response; // Ensure data extraction from response

//   //       setAuthTokens(data);
//   //       // setUser(jwtDecode<User>(data.access));
//   //       localStorage.setItem("authTokens", JSON.stringify(data));
//   //     } else {
//   //       logout();
//   //     }

//   //     if (loading) {
//   //       setLoading(false);
//   //     }
//   //   } catch (error) {
//   //     console.error("Failed to update token:", error);
//   //     logout();
//   //   }
//   // };

//   const updateToken = async () => {
//     try {
//       // Retrieve tokens from localStorage
//       const localAuthTokens = localStorage.getItem("authTokens");
//       if (!localAuthTokens) {
//         console.log("No auth tokens found, logging out");
//         logout();
//         return;
//       }

//       // Parse tokens
//       const parsedAuthTokens = JSON.parse(localAuthTokens);
//       if (!parsedAuthTokens?.refresh) {
//         console.log("No refresh token found, logging out");
//         logout();
//         return;
//       }

//       console.log("Updating token");

//       // Make request to refresh token
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
//       console.log("response", response);
//       if (response.status === 200) {
//         const { data } = response; // Extract data from response
//         setAuthTokens(data);

//         try {
//           setUser(jwtDecode(data.access)); // Decode and set user
//         } catch (decodeError) {
//           console.error("Failed to decode token:", decodeError);
//         }

//         localStorage.setItem("authTokens", JSON.stringify(data));
//       } else {
//         console.warn("Token refresh response not 200, logging out");
//         logout();
//       }
//     } catch (error) {
//       console.error("Failed to update token:", error);
//       logout();
//     } finally {
//       if (loading) {
//         setLoading(false); // Ensure loading state is set to false
//       }
//     }
//   };

//   useEffect(() => {
//     if (loading) {
//       updateToken();
//     }

//     const interval = setInterval(() => {
//       if (authTokens) {
//         updateToken();
//       }
//     }, 1000 * 60 * 60); // 60 minutes
//     return () => clearInterval(interval);
//   }, [authTokens, loading]);

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
