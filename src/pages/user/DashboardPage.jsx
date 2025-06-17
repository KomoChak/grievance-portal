import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import axios from "axios";

export default function DashboardPage() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/grievances/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGrievances(res.data.grievances);
      } catch (err) {
        setError("Could not load grievances.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, []);

  const total = grievances.length;
const resolved = grievances.filter((g) => g.status === "closed").length;
const pending = grievances.filter((g) => g.status !== "closed").length;


  const stats = [
    {
      label: "Total Grievances",
      value: total,
      icon: <AssignmentTurnedInIcon fontSize="large" />,
      color: "#1A237E",
      bg: "#E8EAF6",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: <CheckCircleIcon fontSize="large" />,
      color: "#388E3C",
      bg: "#E8F5E9",
    },
    {
      label: "Pending",
      value: pending,
      icon: <HourglassEmptyIcon fontSize="large" />,
      color: "#F9A825",
      bg: "#FFFDE7",
    },
  ];

  const recentActivity = grievances
    .slice(-5)
    .reverse()
    .map((g) => ({
      id: g._id,
      action: g.status.charAt(0).toUpperCase() + g.status.slice(1),
      date: new Date(g.updatedAt || g.createdAt).toLocaleDateString(),
      details: g.title,
    }));

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", background: "#f4f6f8" }}>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
        <Box sx={{ pt: 2, pb: 1 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", letterSpacing: 0.5 }}>
            Welcome, Coal India Employee!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", textAlign: "center", mt: 1 }}>
            Here’s a quick overview of your grievance activity.
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 2.5,
                  bgcolor: stat.bg,
                  color: stat.color,
                  border: "none",
                  boxShadow: 0,
                  borderRadius: 2,
                  minHeight: 90,
                }}
              >
                <Box sx={{ mr: 2 }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="body2" sx={{ color: stat.color, fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mb: 3,
            minHeight: { xs: 0, md: 240 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 0,
              height: 210,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 0,
              borderRadius: 3,
              borderColor: "#1A237E",
              transition: "box-shadow 0.2s, border 0.2s",
              "&:hover": { boxShadow: 4, borderColor: "#0d1336" },
              cursor: "pointer",
              bgcolor: "#fff",
              textAlign: "center",
            }}
            onClick={() => (window.location.href = "/submit-grievance")}
          >
            <AddCircleIcon sx={{ fontSize: 48, color: "#1A237E", mb: 1.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: "#222" }}>
              Submit Grievance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Raise a new grievance for quick resolution.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "#1A237E",
                borderRadius: 2,
                px: 4,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { background: "#0d1336" },
              }}
              startIcon={<AddCircleIcon />}
            >
              Register Now
            </Button>
          </Card>

          <Card
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 0,
              height: 210,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 0,
              borderRadius: 3,
              borderColor: "#F9A825",
              transition: "box-shadow 0.2s, border 0.2s",
              "&:hover": { boxShadow: 4, borderColor: "#b28704" },
              cursor: "pointer",
              bgcolor: "#fff",
              textAlign: "center",
            }}
            onClick={() => (window.location.href = "/my-grievances")}
          >
            <ListAltIcon sx={{ fontSize: 48, color: "#F9A825", mb: 1.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: "#222" }}>
              View My Grievances
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Check the status and details of your submitted grievances.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "#F9A825",
                borderRadius: 2,
                px: 4,
                fontWeight: 600,
                textTransform: "none",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { background: "#b28704" },
              }}
              startIcon={<ListAltIcon />}
            >
              View History
            </Button>
          </Card>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 0, mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <NotificationsActiveIcon sx={{ color: "#1A237E" }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#222" }}>
              Recent Activity
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : recentActivity.length === 0 ? (
            <Alert severity="info">No recent activity.</Alert>
          ) : (
            <Box sx={{ width: "100%", overflowX: { xs: "auto", md: "visible" } }}>
              <Table size="small" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: "#555" }}>Grievance ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#555" }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#555" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#555" }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.id}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
