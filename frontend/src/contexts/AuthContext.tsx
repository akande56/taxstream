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
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  role: string[];
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>({ role: ["admin"] });

  const login = () => {
    setUser(null);
  };

  const logout = () => {
    setUser(null);
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
