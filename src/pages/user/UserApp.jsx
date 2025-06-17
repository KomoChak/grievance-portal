import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import DashboardPage from "../DashboardPage";
import GrievanceFormPage from "../GrievanceFormPage";
import MyGrievancesPage from "../MyGrievancesPage";
import GrievanceDetailPage from "../GrievanceDetailPage";
import ProfilePage from "../ProfilePage";
import { Box } from "@mui/material";

export default function UserApp() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: "250px", display: "flex", flexDirection: "column" }}>
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
      <Footer />
    </Box>
  );
}
