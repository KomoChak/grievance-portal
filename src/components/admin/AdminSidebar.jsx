import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Collapse,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminSidebar({ role, closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [openGrievances, setOpenGrievances] = useState(true);
  const [openCategories, setOpenCategories] = useState(true);

  const grievanceLinks = role === "superadmin"
    ? [{ label: "Total Grievances", href: "/admin/manage-grievances/total" }]
    : [
        { label: "Submitted", href: "/admin/manage-grievances/submitted" },
        { label: "Pending", href: "/admin/manage-grievances/pending" },
        { label: "Action Taken", href: "/admin/manage-grievances/action-taken" },
        { label: "Closed", href: "/admin/manage-grievances/closed" },
      ];

  const categoryLinks = [
    { label: "Add Category", icon: <AddBoxIcon />, href: "/admin/manage-categories/add-category" },
    { label: "Add Subcategory", icon: <SubdirectoryArrowRightIcon />, href: "/admin/manage-categories/add-subcategory" },
  ];

  const extraLinks = [];
  if (role === "subsidiaryadmin") {
    extraLinks.push({ label: "Manage Area Admin", icon: <PeopleIcon />, href: "/admin/manage-area-admin" });
  }
  if (role === "superadmin") {
    extraLinks.push({ label: "Manage Registrations", icon: <PeopleIcon />, href: "/admin/manage-registrations" });
    extraLinks.push({ label: "Manage Admin", icon: <PeopleIcon />, href: "/admin/manage-admin" });
  }

  const isGrievancesSelected = grievanceLinks.some((l) => location.pathname === l.href);
  const isCategoriesSelected = categoryLinks.some((l) => location.pathname === l.href);

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
        pt: { xs: "56px", sm: "64px" },
        boxShadow: 6,
        overflowY: "auto",
      }}
    >
      <List>
        <ListItemButton
          onClick={() => handleNav("/admin/dashboard")}
          selected={location.pathname === "/admin/dashboard"}
          sx={{
            color: "#fff",
            borderRadius: 2,
            mx: 1,
            mb: 1,
            fontWeight: 600,
            background: location.pathname === "/admin/dashboard" ? "#283046" : "transparent",
            "&:hover": { background: "#283046" },
          }}
        >
          <ListItemIcon sx={{ color: "#90caf9", minWidth: 36 }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Grievance Menu */}
        <ListItemButton
          onClick={() => setOpenGrievances((prev) => !prev)}
          selected={isGrievancesSelected}
          sx={{
            color: "#fff",
            borderRadius: 2,
            mx: 1,
            mb: 1,
            fontWeight: 600,
            background: isGrievancesSelected ? "#283046" : "transparent",
            "&:hover": { background: "#283046" },
          }}
        >
          <ListItemIcon sx={{ color: "#90caf9", minWidth: 36 }}>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Grievances" />
          {openGrievances ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openGrievances} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {grievanceLinks.map((l) => (
              <ListItemButton
                key={l.label}
                onClick={() => handleNav(l.href)}
                selected={location.pathname === l.href}
                sx={{
                  color: "#fff",
                  pl: 5,
                  borderRadius: 2,
                  mx: 1,
                  mb: 1,
                  fontWeight: 500,
                  background: location.pathname === l.href ? "#3949ab" : "transparent",
                  "&:hover": { background: "#3949ab" },
                }}
              >
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Category Management */}
        {role === "superadmin" && (
          <>
            <ListItemButton
              onClick={() => setOpenCategories((prev) => !prev)}
              selected={isCategoriesSelected}
              sx={{
                color: "#fff",
                borderRadius: 2,
                mx: 1,
                mb: 1,
                fontWeight: 600,
                background: isCategoriesSelected ? "#283046" : "transparent",
                "&:hover": { background: "#283046" },
              }}
            >
              <ListItemIcon sx={{ color: "#90caf9", minWidth: 36 }}>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Categories" />
              {openCategories ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCategories} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categoryLinks.map((l) => (
                  <ListItemButton
                    key={l.label}
                    onClick={() => handleNav(l.href)}
                    selected={location.pathname === l.href}
                    sx={{
                      color: "#fff",
                      pl: 5,
                      borderRadius: 2,
                      mx: 1,
                      mb: 1,
                      fontWeight: 500,
                      background: location.pathname === l.href ? "#3949ab" : "transparent",
                      "&:hover": { background: "#3949ab" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#90caf9", minWidth: 36 }}>
                      {l.icon}
                    </ListItemIcon>
                    <ListItemText primary={l.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Other Role-Specific Links */}
        {extraLinks.map((l) => (
          <ListItemButton
            key={l.label}
            onClick={() => handleNav(l.href)}
            selected={location.pathname === l.href}
            sx={{
              color: "#fff",
              borderRadius: 2,
              mx: 1,
              mb: 1,
              fontWeight: 600,
              background: location.pathname === l.href ? "#283046" : "transparent",
              "&:hover": { background: "#283046" },
            }}
          >
            <ListItemIcon sx={{ color: "#90caf9", minWidth: 36 }}>
              {l.icon}
            </ListItemIcon>
            <ListItemText primary={l.label} />
          </ListItemButton>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ mt: "auto", mb: 2, textAlign: "center" }}>
        <Divider sx={{ bgcolor: "#fff", opacity: 0.18, mb: 1 }} />
        <Avatar
          src="/employee_icon.png"
          alt="Admin Icon"
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
          Welcome, Admin
        </Typography>
        <ListItemButton
          onClick={() => {
            logout();
            navigate("/admin/login");
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
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </ListItemButton>
      </Box>
    </Box>
  );
}
