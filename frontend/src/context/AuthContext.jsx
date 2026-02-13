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
    if (data?.preferences?.theme === "DARK") {
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

  const updateUser = (hasCompletedOnboarding) => {
    const newAuth = { ...auth, user: { ...auth.user, onboardingCompleted: hasCompletedOnboarding }, onboardingCompleted: hasCompletedOnboarding };
    // Note: Backend sending 'onboardingCompleted' at top level and inside user object in AuthController.
    // We should update both to be safe.
    localStorage.setItem("auth", JSON.stringify(newAuth));
    setAuth(newAuth);
  };

  // On mount check theme
  if (auth?.preferences?.theme === "DARK") {
    document.documentElement.classList.add("dark");
  }

  /* New Register Function */
  const register = async (name, email, password, role, extraData = {}) => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, ...extraData })
    });

    if (!response.ok) {
      // Try to parse as JSON first, fall back to text
      const contentType = response.headers.get("content-type");
      let errorMessage = "Registration failed";

      try {
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          errorMessage = err.message || err || errorMessage;
        } else {
          errorMessage = await response.text();
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    login(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
