import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const navLinks = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { label: "Submit Grievance", icon: <AddCircleIcon />, href: "/submit-grievance" },
  { label: "My Grievances", icon: <ListAltIcon />, href: "/my-grievances" },
  { label: "Profile", icon: <AccountCircleIcon />, href: "/profile" },
];

export default function Sidebar({ closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  // State for user's name
  const [userName, setUserName] = useState("Employee");

  // Fetch user name on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name || "Employee");
      } catch {
        setUserName("Employee");
      }
    };
    fetchUser();
  }, []);

  const handleNav = (href) => {
    navigate(href);
    if (closeSidebar) closeSidebar();
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        bgcolor: "#1A237E",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        boxShadow: 6,
        overflow: "hidden",
        pt: 0,
      }}
    >
      <List sx={{ flex: "0 0 auto", pt: 8 }}>
        {navLinks.map((nav) => (
          <ListItemButton
            key={nav.label}
            onClick={() => handleNav(nav.href)}
            selected={location.pathname === nav.href}
            sx={{
              color: "#fff",
              borderRadius: 2,
              mx: 1,
              mb: 1,
              fontWeight: 600,
              background: location.pathname === nav.href ? "#283046" : "transparent",
              "&:hover": { background: "#283046" },
              transition: "background 0.2s",
            }}
          >
            <ListItemIcon sx={{ color: "#90caf9", minWidth: 36 }}>{nav.icon}</ListItemIcon>
            <ListItemText primary={nav.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ bgcolor: "#fff", opacity: 0.18, my: 1 }} />
      {/* Bottom avatar, welcome, and logout */}
      <Box sx={{ textAlign: "center", pb: 2, mt: "auto" }}>
        <Avatar
          src="/employee_icon.png"
          alt="Employee Icon"
          sx={{
            mx: "auto",
            mb: 1,
            width: 48,
            height: 48,
            bgcolor: "#fff",
            border: "2px solid #90caf9"
          }}
        />
        <Typography variant="body2" sx={{ color: "#cfd8dc" }}>
          Welcome, {userName}
        </Typography>
        <ListItemButton
          onClick={() => {
            localStorage.clear();
            navigate("/");
            if (closeSidebar) closeSidebar();
          }}
          sx={{
            color: "#fff",
            justifyContent: "center",
            mt: 1,
            borderRadius: 2,
            mx: 6,
            background: "rgba(255,255,255,0.06)",
            "&:hover": { background: "#d32f2f", color: "#fff" },
            transition: "background 0.2s",
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </ListItemButton>
      </Box>
    </Box>
  );
}