import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);

    // Apply Theme directly
    if (data.preferences?.theme === "DARK") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    document.documentElement.classList.remove("dark");
  };

  // On mount check theme
  if (auth?.preferences?.theme === "DARK") {
    document.documentElement.classList.add("dark");
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
