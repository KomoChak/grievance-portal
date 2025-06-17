import React, { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  useEffect(() => {
    const syncAdmin = () => {
      const stored = localStorage.getItem("admin");
      setAdmin(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", syncAdmin);
    return () => window.removeEventListener("storage", syncAdmin);
  }, []);

  const token = admin?.token || null;

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
