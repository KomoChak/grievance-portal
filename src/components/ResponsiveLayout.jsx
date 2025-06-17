import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const drawerWidth = 250;

export default function ResponsiveLayout({
  children,
  SidebarComponent,
  sidebarProps = {},
  title = "Coal India Grievance Portal",
  isAdmin = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogoClick = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", bgcolor: "#f4f6fa", overflowX: "hidden" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#1A237E",
          width: "100vw",
          left: 0,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* Logo inside AppBar, clickable */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mr: 2,
            }}
            onClick={handleLogoClick}
            aria-label="Go to Dashboard"
          >
            <img
              src="/coal-india-logo.png"
              alt="Coal India"
              style={{
                height: 40,
                borderRadius: 6,
                background: "rgba(255,255,255,0.08)",
                padding: 2,
                marginRight: 8,
              }}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: "#fff",
              fontSize: { xs: 18, md: 22 },
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#1A237E",
              color: "#fff",
              overflowX: "hidden",
              overflowY: "auto",
              pt: 2,
              height: "100vh",
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          <SidebarComponent
            {...sidebarProps}
            closeSidebar={isMobile ? handleDrawerToggle : undefined}
          />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: "100vw", md: `calc(100vw - ${drawerWidth}px)` },
          pt: { xs: 8, md: 8 },
          px: { xs: 1, sm: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
