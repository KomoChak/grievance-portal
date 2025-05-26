import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1565c0' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src="/coal-india-logo.png" alt="Coal India" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Coal India Grievance Portal
          </Typography>
        </Box>
        <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
        <Button color="inherit" component={RouterLink} to="/submit-grievance">Submit Grievance</Button>
        <Button color="inherit" component={RouterLink} to="/my-grievances">My Grievances</Button>
        <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
