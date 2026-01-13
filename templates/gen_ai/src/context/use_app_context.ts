import { useContext } from "react";
import type { AppContextType } from "./app_context";
import { AppContext } from "./app_context";

/**
 * A custom React hook to access the application-wide state and methods provided by the ContextProvider using React Context.
 * @returns {AppContextType} - An object containing application-wide state and methods.
 * @throws {Error} - Throws an error if used outside the context of a ContextProvider.
 * @description This hook allows components to access the application-wide state and methods provided by the ContextProvider using React Context. It retrieves the context value using the useContext hook and ensures that the context is available. If used outside the context of an ContextProvider, it throws an error instructing developers to use it within an ContextProvider.
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }
  return context;
};
