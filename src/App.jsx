import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GrievanceFormPage from "./pages/GrievanceFormPage";
import MyGrievancesPage from "./pages/MyGrievancesPage";
import GrievanceDetailPage from "./pages/GrievanceDetailPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/";

  if (isLogin) {
    // For login page, render ONLY the login page (no sidebar, no navbar, no flex layout)
    return <LoginPage />;
  }

  // For all other pages, render sidebar, navbar, and main content in flex layout
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: "250px", // shift right for sidebar width
          transition: "margin 0.3s",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Navbar />
        <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/submit-grievance" element={<GrievanceFormPage />} />
            <Route path="/my-grievances" element={<MyGrievancesPage />} />
            <Route path="/grievances/:id" element={<GrievanceDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;