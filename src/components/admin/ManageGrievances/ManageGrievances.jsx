import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Snackbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from "@mui/material";
import { useAdminAuth } from "../../../context/AdminAuthContext";

const ManageGrievances = () => {
  const { admin } = useAdminAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarkDialog, setRemarkDialog] = useState({ open: false, grievanceId: null });
  const [remarkText, setRemarkText] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [assignDialog, setAssignDialog] = useState({ open: false, grievanceId: null });
  const [areaAdmins, setAreaAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await axios.get("/admins/grievances", {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });
        setGrievances(res.data.grievances || []);
      } catch (err) {
        console.error("❌ Error fetching grievances:", err);
        setGrievances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, [admin]);

  const sendReminder = async (grievanceId) => {
    try {
      console.log("🔔 Sending reminder for grievance:", grievanceId);
      setSnackbar({ open: true, message: "Reminder sent to Subsidiary Admin." });
    } catch (err) {
      console.error("❌ Error sending reminder:", err);
    }
  };

  const handleRemarkSubmit = async () => {
    try {
      await axios.post(
        `/grievances/${remarkDialog.grievanceId}/add-remark`,
        { remark: remarkText },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );

      setSnackbar({ open: true, message: "✅ Remark added successfully." });
      setRemarkDialog({ open: false, grievanceId: null });
      setRemarkText("");
    } catch (err) {
      console.error("❌ Error submitting remark:", err);
    }
  };

  const openRemarkDialog = (id) => {
    setRemarkDialog({ open: true, grievanceId: id });
  };

  const openAssignDialog = async (grievanceId) => {
    try {
      const res = await axios.get("/admins/area-admins", {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      setAreaAdmins(res.data.admins || []);
      setAssignDialog({ open: true, grievanceId });
    } catch (err) {
      console.error("❌ Error fetching area admins:", err);
    }
  };

  const handleAssignAdmin = async () => {
    try {
      await axios.post(
        `/grievances/${assignDialog.grievanceId}/assign-area-admin`,
        { areaAdminId: selectedAdmin },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      setSnackbar({ open: true, message: "✅ Area Admin assigned." });
      setAssignDialog({ open: false, grievanceId: null });
      setSelectedAdmin("");
    } catch (err) {
      console.error("❌ Error assigning area admin:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Manage Grievances
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : grievances.length === 0 ? (
        <Typography>No grievances found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {grievances.map((g) => (
            <Grid item key={g._id} xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{g.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Complainant: {g.user?.name || "Unknown"}
                  </Typography>
                  <Typography variant="body2">
                    Date: {new Date(g.createdAt).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={g.status}
                    color="primary"
                    size="small"
                    sx={{ mt: 1, mb: 1 }}
                  />

                  {admin?.role === "superadmin" && (
                    <Button
                      variant="outlined"
                      color="warning"
                      fullWidth
                      onClick={() => sendReminder(g._id)}
                      sx={{ mt: 1 }}
                    >
                      🔔 Send Reminder
                    </Button>
                  )}

                  {admin?.role === "areaadmin" && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => openRemarkDialog(g._id)}
                      sx={{ mt: 1 }}
                    >
                      Add Remark / Close
                    </Button>
                  )}

                  {admin?.role === "subsidiaryadmin" && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => openAssignDialog(g._id)}
                      sx={{ mt: 1 }}
                    >
                      Assign Area Admin
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Remark Dialog */}
      <Dialog open={remarkDialog.open} onClose={() => setRemarkDialog({ open: false, grievanceId: null })}>
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <TextField
            label="Remark"
            fullWidth
            multiline
            rows={4}
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialog({ open: false, grievanceId: null })}>Cancel</Button>
          <Button onClick={handleRemarkSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Area Admin Dialog */}
      <Dialog open={assignDialog.open} onClose={() => setAssignDialog({ open: false, grievanceId: null })}>
        <DialogTitle>Assign Area Admin</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Area Admin"
            fullWidth
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            margin="dense"
          >
            <MenuItem value="">-- Select --</MenuItem>
            {areaAdmins.map((a) => (
              <MenuItem key={a._id} value={a._id}>
                {a.name} ({a.area?.name})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog({ open: false, grievanceId: null })}>Cancel</Button>
          <Button onClick={handleAssignAdmin} variant="contained" color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ManageGrievances;