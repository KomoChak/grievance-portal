import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";

const COLORS = {
  primary: "#1A237E",
  secondary: "#F9A825",
  success: "#388E3C",
  error: "#D32F2F",
  warning: "#F9A825",
  background: "#f4f6f8",
  cardBg: "#fff",
  textPrimary: "#222",
  textSecondary: "#757575"
};

const STATUS_MAP = {
  pending: { color: "warning", icon: <HourglassEmptyIcon fontSize="small" /> },
  in_progress: { color: "info", icon: <HourglassEmptyIcon fontSize="small" /> },
  action_taken: { color: "info", icon: <HourglassEmptyIcon fontSize="small" /> },
  submitted: { color: "info", icon: <HourglassEmptyIcon fontSize="small" /> },
  closed: { color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  rejected: { color: "error", icon: <ErrorOutlineIcon fontSize="small" /> }
};

export default function MyGrievancesPage() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/grievances/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGrievances(res.data.grievances);
      } catch (err) {
        setError("Could not load grievances. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, []);

  const getDisplayStatus = (status) => {
    return status === "closed" ? "Closed" : "Pending";
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", background: COLORS.background, py: 4 }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" color={COLORS.primary} sx={{ mb: 0.5 }}>
              My Grievances
            </Typography>
            <Typography variant="subtitle1" color={COLORS.textSecondary}>
              Review the details and status of your submitted grievances.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            href="/submit-grievance"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              backgroundColor: COLORS.primary,
              "&:hover": { backgroundColor: "#0d1336" },
              textTransform: "none"
            }}
          >
            Submit New Grievance
          </Button>
        </Stack>
        {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && grievances.length === 0 && (
          <Alert severity="info">No grievances found. Submit your first grievance!</Alert>
        )}
        {grievances.map((grievance) => (
          <Card
            key={grievance._id}
            variant="outlined"
            sx={{
              mb: 4,
              borderRadius: 3,
              p: 0,
              background: COLORS.cardBg,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
              overflow: "visible"
            }}
          >
            <CardHeader
              title="Grievance Summary"
              sx={{
                background: `${COLORS.primary}10`,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                pb: 1,
                pl: 3,
                color: COLORS.primary,
                fontWeight: "bold",
                letterSpacing: 1
              }}
            />
            <CardContent sx={{ pt: 3, pb: 0, px: 3 }}>
              <Grid container rowSpacing={3} columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                    Grievance Number
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color={COLORS.textPrimary}>
                    {grievance._id}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                    Registration Date
                  </Typography>
                  <Typography variant="body1" color={COLORS.textPrimary}>
                    {new Date(grievance.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                    Category
                  </Typography>
                  <Typography variant="body1" color={COLORS.textPrimary}>
                    {grievance.category || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                    Subject
                  </Typography>
                  <Typography variant="body1" color={COLORS.textPrimary}>
                    {grievance.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                    Grievance Details
                  </Typography>
                  <Typography variant="body1" color={COLORS.textPrimary} sx={{ whiteSpace: "pre-line" }}>
                    {grievance.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                    Current Status
                  </Typography>
                  <Chip
                    icon={STATUS_MAP[grievance.status?.toLowerCase()]?.icon}
                    label={getDisplayStatus(grievance.status)}
                    color={STATUS_MAP[grievance.status?.toLowerCase()]?.color || "default"}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                </Grid>

                {/* ✅ Show employee-visible remarks */}
                {grievance.remarks && grievance.remarks.filter(r => r.to === "employee").length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color={COLORS.textSecondary} gutterBottom>
                      Admin Remarks
                    </Typography>
                    {grievance.remarks
                      .filter(r => r.to === "employee")
                      .map((remark, idx) => (
                        <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                          • {remark.message}
                        </Typography>
                      ))}
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <Divider sx={{ my: 3 }} />
          </Card>
        ))}
      </Box>
    </Box>
  );
}
