// AuthProvider.js (session state management using localStorage)

import React, { createContext, useState, useEffect } from "react";

// Create a context for managing session state
export const AuthContext = createContext();

// Create an AuthProvider component
export const AuthProvider = ({ children }) => {
  // Initialize state for storing session data
  const [userType, setUserType] = useState(null);

  // Check for session data in localStorage on component mount
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  // Update session data in localStorage and state on login
  const login = (userType) => {
    localStorage.setItem("userType", userType);
    setUserType(userType);
  };

  // Update session data in localStorage and state on logout
  const logout = () => {
    localStorage.removeItem("userType");
    setUserType(null);
  };

  // Provide session data and methods to child components
  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
