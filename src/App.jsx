import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ResponsiveLayout from "./components/ResponsiveLayout";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { UserAuthProvider } from './context/UserAuthContext'; // Adjust path as needed

// User pages
import LoginPage from "./pages/user/LoginPage";
import DashboardPage from "./pages/user/DashboardPage";
import SubmitGrievancePage from "./pages/user/SubmitGrievancePage";
import MyGrievancesPage from "./pages/user/MyGrievancesPage";
import GrievanceDetailPage from "./pages/user/GrievanceDetailPage";
import ProfilePage from "./pages/user/ProfilePage";
import NotFound from "./pages/user/NotFound";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminApp from "./pages/admin/AdminApp";

export default function App() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <UserAuthProvider>
      {/* 1. User login page (no sidebar/layout) */}
      {path === "/" ? (
        <LoginPage />
      ) : /* 2. Admin login page (no sidebar/layout) */
      path === "/admin/login" ? (
        <AdminLoginPage />
      ) : /* 3. Admin portal (all /admin/* except /admin/login) */
      path.startsWith("/admin") && path !== "/admin/login" ? (
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      ) : (
        /* 4. User portal (with sidebar and layout) */
        <ResponsiveLayout SidebarComponent={Sidebar} title="Grievance Portal">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/submit-grievance" element={<SubmitGrievancePage />} />
            <Route path="/my-grievances" element={<MyGrievancesPage />} />
            <Route path="/grievances/:id" element={<GrievanceDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ResponsiveLayout>
      )}
    </UserAuthProvider>
  );
}