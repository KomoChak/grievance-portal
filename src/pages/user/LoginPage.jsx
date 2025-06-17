import React, { useState } from 'react';
import {
  Box, Grid, Paper, Typography, Tabs, Tab, TextField, Button, Avatar,
  InputAdornment, IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import { useUserAuth } from '../../context/UserAuthContext';
import { apiRequest } from '../../utils/api';

const indigo = '#1A237E';

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ employeeId: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', employeeId: '', password: '', email: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useUserAuth();

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: loginData
      });
      if (data.token && data.user) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert(err.message || 'Login error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: registerData
      });
      if (data.token && data.user) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert(err.message || 'Registration error');
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100vh' }} justifyContent="center" alignItems="stretch">
        {/* LEFT PANEL */}
        <Grid xs={5} sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: `linear-gradient(rgba(26,35,126,0.8), rgba(26,35,126,0.8)), url("/mining-bg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          px: 6,
          height: '100%',
          position: 'relative',
        }}>
          <Box sx={{ pt: 8 }}>
            <img src="/coal-india-logo.png" alt="Coal India Limited" style={{
              height: 80, marginBottom: 24, background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 8
            }} />
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
          </Box>
          <Box sx={{ pb: 3, pl: 1 }}>
            <Typography variant="caption" sx={{ color: '#fff', opacity: 0.7 }}>
              © {new Date().getFullYear()} Coal India Limited. All rights reserved.
            </Typography>
          </Box>
        </Grid>

        {/* RIGHT PANEL */}
        <Grid xs={12} md={7} component={Paper} elevation={8} square sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 2, md: 2 },
        }}>
          <Box sx={{
            width: '100%',
            maxWidth: 360,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}>
            <Avatar sx={{ m: 1, bgcolor: indigo }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 2, color: indigo }}>
              {tab === 0 ? 'Employee Login' : 'Register'}
            </Typography>
            <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 2, width: '100%' }}>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {/* LOGIN FORM */}
            {tab === 0 && (
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  fullWidth margin="dense" label="Employee ID" required size="small"
                  value={loginData.employeeId} onChange={e => setLoginData({ ...loginData, employeeId: e.target.value })}
                />
                <TextField
                  fullWidth margin="dense" label="Password" required size="small"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowLoginPassword(p => !p)} edge="end" size="small">
                          {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{
                  mt: 2, mb: 1, bgcolor: indigo, fontWeight: 'bold',
                  '&:hover': { bgcolor: '#283046' }
                }}>
                  Sign In
                </Button>
              </Box>
            )}

            {/* REGISTER FORM */}
            {tab === 1 && (
              <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  fullWidth margin="dense" label="Full Name" required size="small"
                  value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} />
                <TextField
                  fullWidth margin="dense" label="Employee ID" required size="small"
                  value={registerData.employeeId} onChange={e => setRegisterData({ ...registerData, employeeId: e.target.value })} />
                <TextField
                  fullWidth margin="dense" label="Email" type="email" required size="small"
                  value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
                <TextField
                  fullWidth margin="dense" label="Password" required size="small"
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowRegisterPassword(p => !p)} edge="end" size="small">
                          {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{
                  mt: 2, mb: 1, bgcolor: indigo, fontWeight: 'bold',
                  '&:hover': { bgcolor: '#283046' }
                }}>
                  Register
                </Button>
              </Box>
            )}

            <Button variant="outlined" fullWidth sx={{
              mt: 1, fontWeight: 'bold', borderColor: indigo, color: indigo,
              '&:hover': { bgcolor: indigo, color: '#fff', borderColor: '#283046' }
            }} onClick={() => navigate('/admin/login')}>
              Login as Admin
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
