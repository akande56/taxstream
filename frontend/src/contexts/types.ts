/* eslint-disable @typescript-eslint/no-explicit-any */
export type LoginParams = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterParams = {
  username: string;
  password: string;
};

// export type UserDataType = {
//   _id: string;
//   avatar?: string;
//   role: string;
//   displayName: string;
//   username: string;
//   registerDate?: string;
// };

// export type UserDataType = {
//   exp: string;
//   iat: string;
//   jti: string;
//   token_type: string;
//   user_id: string;
// };
export type UserDataType = {
  id: string;
  username: string;
  role: string;
  email: string;
};

export type AuthValuesType = {
  user: UserDataType | null;
  setUser: (value: UserDataType | null) => void;
  editUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  isInitialized: boolean;
  setIsInitialized: (value: boolean) => void;
};
