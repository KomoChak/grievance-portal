import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from "../../context/AdminAuthContext";

const INDIGO = '#1A237E';
const WHITE = '#fff';

export default function AdminNavbar({ adminName, adminRole }) {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogoClick = () => {
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        bgcolor: INDIGO,
        color: WHITE,
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ minHeight: 70, px: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Logo + Portal Name */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            minWidth: 300,
          }}
          onClick={handleLogoClick}
          aria-label="Go to Dashboard"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') handleLogoClick(); }}
        >
          <img
            src="/coal-india-logo.png"
            alt="Coal India"
            style={{
              height: 40,
              marginRight: 14,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.08)',
              padding: 4,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: WHITE,
              fontSize: { xs: 16, md: 20 },
              whiteSpace: 'nowrap',
            }}
          >
            Coal India Grievance Portal
          </Typography>
        </Box>

        {/* Center: Admin Portal */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: WHITE,
              fontSize: { xs: 16, md: 20 },
              opacity: 0.95,
              whiteSpace: 'nowrap',
            }}
          >
            Admin Portal
          </Typography>
        </Box>

        {/* Right: Role and Logout */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          flexWrap: 'nowrap',
          minWidth: 180,
          justifyContent: 'flex-end'
        }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: WHITE,
              fontWeight: 600,
              px: 2,
              letterSpacing: 1,
              textTransform: 'capitalize',
            }}
          >
            {adminRole}
          </Typography>
          <Button
            onClick={handleLogout}
            sx={{
              color: '#FFD6D6',
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#fff',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}