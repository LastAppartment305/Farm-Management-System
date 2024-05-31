import { createContext, useState, useContext } from "react";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const IsAdmin = () => {
    setIsAuthenticated(true);
  };
  const IsOwner = () => {
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    role,
    setRole,
    IsAdmin,
    IsOwner,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const authContext = createContext();
