import React, { useState } from 'react';
import {
  Box, Grid, Paper, Typography, Tabs, Tab, TextField, Button, Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const blue = '#1565c0';

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ employeeId: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', employeeId: '', password: '', email: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);


  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = '/dashboard';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    window.location.href = '/dashboard';
  };
  const handleToggleLoginPassword = () => setShowLoginPassword((show) => !show);
  const handleToggleRegisterPassword = () => setShowRegisterPassword((show) => !show);


  return (
    <Grid
      container
      sx={{ minHeight: '100vh' }}
      columnSpacing={{ xs: 0, md: 4 }}
    >
      {/* LEFT: Branding panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(rgba(21,101,192,0.7), rgba(21,101,192,0.7)), url("/mining-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          px: 8,
          position: 'relative',
        }}
      >
        <img
          src="/coal-india-logo.png"
          alt="Coal India Limited"
          style={{
            height: 80,
            marginBottom: 24,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 8,
            padding: 8,
          }}
        />
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Coal India Limited Grievance Portal
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, maxWidth: 420 }}>
          Submit and track your grievances securely and efficiently.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 420, opacity: 0.9 }}>
          This portal enables employees and stakeholders of Coal India Limited to file, track, and resolve grievances in a transparent and timely manner.
        </Typography>
        <Typography variant="h6" sx={{ mt: 4, maxWidth: 420 }}>
          Empowering India’s energy future with commitment and sustainability.
        </Typography>
        <Box sx={{ position: 'absolute', bottom: 20, left: 40, color: '#fff', opacity: 0.7 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} Coal India Limited. All rights reserved.
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT: Form panel */}
      <Grid
        item
        xs={12}
        md={6}
        component={Paper}
        elevation={8}
        square
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            minHeight: 480, // Ensures enough space for both forms
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'min-height 0.3s',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: blue }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {tab === 0 ? 'Employee Login' : 'Register'}
          </Typography>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3, width: '100%' }}
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Employee ID"
                value={loginData.employeeId}
                onChange={e => setLoginData({ ...loginData, employeeId: e.target.value })}
                autoFocus
              />
              <TextField
  margin="normal"
  required
  fullWidth
  label="Password"
  type={showLoginPassword ? "text" : "password"}
  value={loginData.password}
  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleToggleLoginPassword}
          edge="end"
          size="large"
        >
          {showLoginPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3, mb: 2, bgcolor: blue, '&:hover': { bgcolor: '#003c8f' },
                  fontWeight: 'bold', fontSize: 18, letterSpacing: 1,
                }}
                size="large"
              >
                Sign In
              </Button>
            </Box>
          )}
          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                value={registerData.name}
                onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Employee ID"
                value={registerData.employeeId}
                onChange={e => setRegisterData({ ...registerData, employeeId: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              />
              <TextField
  margin="normal"
  required
  fullWidth
  label="Password"
  type={showRegisterPassword ? "text" : "password"}
  value={registerData.password}
  onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleToggleRegisterPassword}
          edge="end"
          size="large"
        >
          {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3, mb: 2, bgcolor: blue, '&:hover': { bgcolor: '#003c8f' },
                  fontWeight: 'bold', fontSize: 18, letterSpacing: 1,
                }}
                size="large"
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}