import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import GrievanceTable from "./GrievanceTable";
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";


const SubmittedGrievances = () => {
  const { token, admin } = useAdminAuth();
  const [grievances, setGrievances] = useState([]);
  const [areaAdmins, setAreaAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [selectedAreaAdmin, setSelectedAreaAdmin] = useState("");


  useEffect(() => {
    fetchGrievances();
    fetchAreaAdmins();
  }, []);


  useEffect(() => {
    if (admin?.subsidiary && areaAdmins.length > 0) {
      const filtered = areaAdmins.filter(
        (adm) => adm.subsidiary?._id?.toString() === admin.subsidiary
      );
      setFilteredAdmins(filtered);
    }
  }, [admin, areaAdmins]);


  const fetchGrievances = async () => {
    try {
      const res = await axios.get("/grievances/submitted", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrievances(res.data.grievances || []);
    } catch (err) {
      console.error("Error fetching submitted grievances:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchAreaAdmins = async () => {
    try {
      const res = await axios.get("/admins/area-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAreaAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Error fetching area admins:", err);
    }
  };


  const handleAssignClick = (grievance) => {
    setSelectedGrievance(grievance);
    setSelectedAreaAdmin("");
    setAssignDialogOpen(true);
  };


  const handleAssignConfirm = async () => {
    if (!selectedAreaAdmin || !selectedGrievance) return;
    try {
      await axios.patch(
        `/grievances/${selectedGrievance._id}/assign`,
        { areaAdminId: selectedAreaAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGrievances((prev) =>
        prev.filter((g) => g._id !== selectedGrievance._id)
      );
      setAssignDialogOpen(false);
    } catch (err) {
      console.error("Error assigning grievance:", err);
    }
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <>
      <GrievanceTable
        title="Submitted Grievances"
        grievances={grievances}
        showAssignButton
        onAssignClick={handleAssignClick}
      />


      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign to Area Admin</DialogTitle>
        <DialogContent>
          {filteredAdmins.length === 0 ? (
            <Typography>No area admins found under your subsidiary.</Typography>
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Area Admin</InputLabel>
              <Select
                value={selectedAreaAdmin}
                onChange={(e) => setSelectedAreaAdmin(e.target.value)}
                label="Select Area Admin"
              >
                {filteredAdmins.map((admin) => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.name} ({admin.area?.name || "Unnamed Area"})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssignConfirm}
            variant="contained"
            disabled={!selectedAreaAdmin}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export default SubmittedGrievances;


