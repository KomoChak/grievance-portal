import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

// Color constants for consistency
const COLORS = {
  primary: "#1A237E",
  background: "#f4f6f8",
  cardBg: "#fff",
  textPrimary: "#222",
  textSecondary: "#757575",
  border: "#e0e0e0"
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Could not load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) return null;

  // Helper to display value or fallback
  const show = (val) => val && val.trim() ? val : "-";

  return (
    <Box sx={{ background: COLORS.background, minHeight: "100vh", py: 5 }}>
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: COLORS.cardBg,
            border: `1px solid ${COLORS.border}`,
            overflow: "visible",
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                src={user.avatar || "/avatar-placeholder.png"}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: COLORS.primary,
                  fontSize: 36,
                  fontWeight: 700,
                  mr: 2,
                }}
              >
                {user.name?.[0] || "U"}
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="bold" color={COLORS.primary}>
                {show(user.name)}
              </Typography>
            }
            subheader={
              <Typography variant="subtitle1" color={COLORS.textSecondary}>
                {show(user.designation)}
              </Typography>
            }
            sx={{ pb: 0, pt: 3, pl: 3, pr: 3, alignItems: "center" }}
            action={
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{
                  color: COLORS.primary,
                  borderColor: COLORS.primary,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#0d1336",
                    background: "rgba(26,35,126,0.06)",
                  },
                }}
              >
                Edit Profile
              </Button>
            }
          />
          <Divider sx={{ my: 2 }} />
          <CardContent sx={{ px: 3, pb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" color={COLORS.textPrimary}>
                  {show(user.email)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1" color={COLORS.textPrimary}>
                  {show(user.phone)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                  Employee ID
                </Typography>
                <Typography variant="body1" color={COLORS.textPrimary}>
                  {show(user.employeeId)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                  Subsidiary
                </Typography>
                <Typography variant="body1" color={COLORS.textPrimary}>
                  {show(user.subsidiary)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                  Unit
                </Typography>
                <Typography variant="body1" color={COLORS.textPrimary}>
                  {show(user.unit)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
