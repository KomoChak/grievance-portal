import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Grid, Paper, Typography, TextField, Button, MenuItem, Avatar, Alert
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAdminAuth } from "../../context/AdminAuthContext";
import axios from "axios";

const indigo = '#1A237E';

const roles = [
  { value: "superadmin", label: "Super Admin" },
  { value: "subsidiaryadmin", label: "Subsidiary Admin" },
  { value: "areaadmin", label: "Area Admin" },
];

export default function AdminLoginPage() {
  const [form, setForm] = useState({ employeeId: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admins/login", {
        employeeId: form.employeeId,
        password: form.password,
        role: form.role
      });

      // Save token and user info in context/localStorage
  login({
  ...res.data.user,     // includes _id, name, role, subsidiary, area, unit
  token: res.data.token // ensure token is stored in admin object
});


      setLoading(false);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100vh' }} justifyContent="center" alignItems="stretch">
        {/* LEFT: Branding */}
        <Grid
          item
          xs={0}
          md={5}
          sx={{
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
          }}
        >
          <Box sx={{ pt: 8 }}>
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
              Coal India Limited Admin Portal
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, maxWidth: 420 }}>
              Secure access for authorized administrators.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, maxWidth: 420, opacity: 0.9 }}>
              Only authorized personnel may log in and manage the grievance portal’s administrative features.
            </Typography>
            <Typography variant="h6" sx={{ mt: 4, maxWidth: 420 }}>
              Ensuring transparency and accountability.
            </Typography>
          </Box>
          <Box sx={{ pb: 3, pl: 1 }}>
            <Typography variant="caption" sx={{ color: '#fff', opacity: 0.7 }}>
              © {new Date().getFullYear()} Coal India Limited. All rights reserved.
            </Typography>
          </Box>
        </Grid>

        {/* RIGHT: Login Form */}
        <Grid
          item
          xs={12}
          md={7}
          component={Paper}
          elevation={8}
          square
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 1, sm: 2, md: 4 },
            py: { xs: 2, md: 2 },
          }}
        >
          <Box sx={{
            width: '100%',
            maxWidth: 360,
            mx: 'auto',
            minHeight: 350,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
            <Avatar sx={{ m: 1, bgcolor: indigo }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 2, color: indigo }}>
              Admin Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                label="Employee ID"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                size="small"
                sx={{ mb: 2 }}
                autoComplete="username"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                size="small"
                sx={{ mb: 2 }}
                autoComplete="current-password"
              />
              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                size="small"
                sx={{ mb: 2 }}
              >
                {roles.map(r => (
                  <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                ))}
              </TextField>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2, bgcolor: indigo, fontWeight: 'bold', fontSize: 16, letterSpacing: 1,
                  '&:hover': { bgcolor: '#283046' }
                }}
                size="medium"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
