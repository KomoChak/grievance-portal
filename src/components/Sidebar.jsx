import React from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const navLinks = [
  { label: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { label: "Submit Grievance", icon: <AddCircleIcon />, href: "/submit-grievance" },
  { label: "My Grievances", icon: <ListAltIcon />, href: "/my-grievances" },
  { label: "Profile", icon: <AccountCircleIcon />, href: "/profile" },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 250,
        minHeight: "100vh",
        bgcolor: "#1565c0",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 4,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box>
        <Box sx={{ textAlign: "center", py: 3 }}>
          <img src="/coal-india-logo.png" alt="Coal India" style={{ height: 60, marginBottom: 8 }} />
          <Typography variant="h6" fontWeight="bold">
            Grievance Portal
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: "#fff", opacity: 0.2, mb: 2 }} />
        <List>
          {navLinks.map((nav) => (
            <ListItemButton
              key={nav.label}
              component="a"
              href={nav.href}
              sx={{
                color: "#fff",
                "&:hover": { bgcolor: "#003c8f" },
                borderRadius: 2,
                mx: 1,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{nav.icon}</ListItemIcon>
              <ListItemText primary={nav.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ textAlign: "center", pb: 3 }}>
        <Avatar src="/avatar-placeholder.png" sx={{ mx: "auto", mb: 1, width: 48, height: 48 }} />
        <Typography variant="body2">Welcome, Employee</Typography>
        <ListItemButton
          component="a"
          href="/logout"
          sx={{
            color: "#fff",
            justifyContent: "center",
            mt: 1,
            "&:hover": { bgcolor: "#003c8f" },
            borderRadius: 2,
            mx: 6,
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </ListItemButton>
      </Box>
    </Box>
  );
}