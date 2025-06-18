import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access-token")); // ✅ Consistent key name

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log("Decoded User ID:", userData.user_id);
      console.log("Token:", token);

      const response = await axios.get("http://127.0.0.1:8000/api/user/info/",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched User:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser(); // ✅ Fetch user on mount

    // ✅ Listen for token changes in localStorage (for cross-tab sync)
    const handleStorageChange = (event) => {
      if (event.key === "access-token") {
        setToken(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // ✅ Check for token changes periodically (for same-tab updates)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("access-token");
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children} {/* ✅ Ensure children are rendered */}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);

