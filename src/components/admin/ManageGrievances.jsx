// 📁 src/components/admin/ManageGrievances/ManageGrievances.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Button
} from "@mui/material";
import axios from "../../../utils/axiosConfig";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import GrievanceTable from "../../../components/GrievanceTable";

export default function ManageGrievances() {
  const { admin } = useAdminAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [areaAdmins, setAreaAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [assignDialog, setAssignDialog] = useState(false);
  const [remarkDialog, setRemarkDialog] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [remarkFile, setRemarkFile] = useState(null);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await axios.get("/admins/grievances", {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        setGrievances(res.data.grievances || []);
      } catch (err) {
        console.error("Error loading grievances", err);
      } finally {
        setLoading(false);
      }
    };
    if (admin) fetchGrievances();
  }, [admin]);

  const openAssignDialog = async (grievance) => {
    try {
      setSelectedGrievance(grievance);
      const res = await axios.get("/admins/area-admins", {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      setAreaAdmins(res.data.admins || []);
      setAssignDialog(true);
    } catch (err) {
      console.error("Failed to fetch area admins", err);
    }
  };

  const handleAssignSubmit = async () => {
    try {
      await axios.put(
        `/admins/assign-grievance/${selectedGrievance._id}`,
        { areaAdminId: selectedAdmin },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      setSnackbar({ open: true, message: "✅ Grievance assigned." });
      setAssignDialog(false);
      setSelectedAdmin("");
    } catch (err) {
      console.error("Assign error", err);
    }
  };

  const handleRemarkSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("remark", remarkText);
      if (remarkFile) formData.append("file", remarkFile);

      await axios.post(`/admins/grievances/${selectedGrievance._id}/add-remark`, formData, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setSnackbar({ open: true, message: "✅ Remark added." });
      setRemarkDialog(false);
      setRemarkText("");
      setRemarkFile(null);
    } catch (err) {
      console.error("Remark error", err);
    }
  };

  const sendReminder = async (grievance) => {
    try {
      await axios.post(`/admins/grievances/${grievance._id}/remind`, null, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      setSnackbar({ open: true, message: "✅ Reminder sent." });
    } catch (err) {
      console.error("Reminder error", err);
    }
  };

  const handleFileChange = (e) => {
    setRemarkFile(e.target.files[0]);
  };

  const handleViewGrievance = (grievance) => {
    setSelectedGrievance(grievance);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>All Grievances</Typography>
      {loading ? <CircularProgress /> : (
        <GrievanceTable grievances={grievances} onView={handleViewGrievance} />
      )}

      {/* Assign Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
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
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignSubmit} variant="contained" disabled={!selectedAdmin}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remark Dialog */}
      <Dialog open={remarkDialog} onClose={() => setRemarkDialog(false)}>
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
          <input type="file" onChange={handleFileChange} style={{ marginTop: 10 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialog(false)}>Cancel</Button>
          <Button onClick={handleRemarkSubmit} variant="contained" color="primary">
            Submit
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
}