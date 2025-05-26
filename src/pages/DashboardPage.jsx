import React from "react";
import {
  Box, Grid, Paper, Typography, Button, Card, CardContent, Container, Stack
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function DashboardPage() {
  const stats = [
    { label: "Total", value: 23, icon: <AssignmentTurnedInIcon fontSize="large" />, color: "#1976d2" },
    { label: "Resolved", value: 15, icon: <CheckCircleIcon fontSize="large" />, color: "#43a047" },
    { label: "Pending", value: 8, icon: <HourglassEmptyIcon fontSize="large" />, color: "#ff9800" },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", background: "#f5f6fa", py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>
          Welcome, Coal India Employee!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: "text.secondary", textAlign: "center" }}>
          Here’s a quick overview of your grievance activity.
        </Typography>

        {/* Status Cards */}
        <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.label}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  px: 2,
                  py: 3,
                  bgcolor: stat.color,
                  color: "#fff",
                  boxShadow: 3,
                  borderRadius: 2,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Actions */}
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: 4,
                borderRadius: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)", boxShadow: 8 },
                cursor: "pointer",
                bgcolor: "#e3f2fd",
                textAlign: "center",
              }}
              onClick={() => window.location.href = "/submit-grievance"}
            >
              <AddCircleIcon sx={{ fontSize: 50, color: "#1976d2", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Submit Grievance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Raise a new grievance for quick resolution.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: 4,
                borderRadius: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)", boxShadow: 8 },
                cursor: "pointer",
                bgcolor: "#fffde7",
                textAlign: "center",
              }}
              onClick={() => window.location.href = "/my-grievances"}
            >
              <ListAltIcon sx={{ fontSize: 50, color: "#ff9800", mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                View My Grievances
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check the status and details of your submitted grievances.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Optional: Recent Activity / Notifications */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <NotificationsActiveIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Recent Activity
            </Typography>
          </Stack>
          <Box sx={{ pl: 5 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Grievance #1234 resolved by Admin (Today)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Grievance #1237 marked as pending (Yesterday)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • New comment on Grievance #1235 (2 days ago)
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
