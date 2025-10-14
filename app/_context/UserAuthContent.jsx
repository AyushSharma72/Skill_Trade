"use client";
import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("auth");

      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setAuth((prevAuth) => ({
            ...prevAuth,
            user: parsedData.user || parsedData.worker || null,
            token: parsedData.token || "",
          }));
        } catch (error) {
          console.error("Failed to parse auth data from localStorage:", error);
        }
      }
      setLoading(false); 
    }
  }, []);

  if (loading) return <div>Loading...</div>; 

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
