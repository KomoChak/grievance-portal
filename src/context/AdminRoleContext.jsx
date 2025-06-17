import React, { createContext, useContext, useState } from 'react';

const AdminRoleContext = createContext();

export const useAdminRole = () => useContext(AdminRoleContext);

export function AdminRoleProvider({ children }) {
  const [adminRole, setAdminRole] = useState(null); // e.g., 'superadmin', 'subsidiaryadmin', 'areaadmin'
  return (
    <AdminRoleContext.Provider value={{ adminRole, setAdminRole }}>
      {children}
    </AdminRoleContext.Provider>
  );
}
