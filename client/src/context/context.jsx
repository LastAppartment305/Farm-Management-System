import { createContext, useState, useContext } from "react";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const IsAdmin = () => {
    setIsAuthenticated(true);
  };

  const value = {
    isAuthenticated,
    IsAdmin,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const authContext = createContext();
