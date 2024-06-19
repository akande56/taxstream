/* eslint-disable react-refresh/only-export-components */
import { createContext, PropsWithChildren, useContext } from "react";
import { useAppState } from "@/helpers/appState";
import { UserDataType } from "./types";

interface IAppContext {
  user: UserDataType;
  updateAppContext: (states: { user?: UserDataType }) => void;
}

const AppContext = createContext<IAppContext | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("Missing App context");
  }

  return {
    ...ctx,
  };
};

export const initialAppValues = {
  user: "",
};

export const AppProvider = ({ children }: PropsWithChildren<object>) => {
  const {
    state: { user },
    updateState,
  } = useAppState<{ user: UserDataType }>({
    user: sessionStorage.getItem("basketItems")
      ? JSON.parse(sessionStorage.getItem("basketItems") as string)
      : initialAppValues.user,
  });

  return (
    <AppContext.Provider
      value={{
        user,
        updateAppContext: updateState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
