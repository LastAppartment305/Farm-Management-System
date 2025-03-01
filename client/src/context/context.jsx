import { createContext, useState, useContext } from "react";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [verifyWorker, setVerifyWorker] = useState(false);

  const IsAdmin = () => {
    setIsAuthenticated(true);
  };
  const IsOwner = () => {
    setIsAuthenticated(false);
  };
  console.log("context", role);
  const value = {
    isAuthenticated,
    role,
    setRole,
    IsAdmin,
    IsOwner,
    setVerifyWorker,
    verifyWorker,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const authContext = createContext();
