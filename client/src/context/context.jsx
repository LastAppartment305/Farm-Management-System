import { createContext, useState, useContext } from "react";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const IsAdmin = () => {
    setIsAuthenticated(true);
  };
  const IsOwner = () => {
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    IsAdmin,
    IsOwner,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const authContext = createContext();
