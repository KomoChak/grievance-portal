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
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";

const ActionTakenGrievances = () => {
  const { token, admin } = useAdminAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [remark, setRemark] = useState("");
  const [closeGrievance, setCloseGrievance] = useState(false);
  const [remarkTo, setRemarkTo] = useState("employee");

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
const res = await axios.get("/grievances/action-taken", {

        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = (res.data.grievances || res.data).filter(
        (g) => g.status === "action_taken"
      );

      setGrievances(filtered);
    } catch (err) {
      console.error("❌ Error fetching action taken grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkClick = (grievance) => {
    setSelectedGrievance(grievance);
    setRemark("");
    setCloseGrievance(false);
    setRemarkTo(admin.role === "areaadmin" ? "employee" : "areaadmin");
    setRemarkDialogOpen(true);
  };

  const handleRemarkSubmit = async () => {
    if (!remark || !selectedGrievance) return;

    try {
      await axios.post(
        `/admins/grievances/${selectedGrievance._id}/add-remark`,
        {
          remark,
          close: closeGrievance,
          to: remarkTo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRemarkDialogOpen(false);
      setSelectedGrievance(null);
      fetchGrievances(); // Refresh
    } catch (err) {
      console.error("❌ Error submitting remark:", err);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Action Taken Grievances
      </Typography>

      {grievances.length === 0 ? (
        <Typography>No grievances found under 'Action Taken'.</Typography>
      ) : (
        <GrievanceTable
          grievances={grievances}
          actionLabel="Add Remark"
          onAction={handleRemarkClick}
        />
      )}

      <Dialog open={remarkDialogOpen} onClose={() => setRemarkDialogOpen(false)}>
        <DialogTitle>
          Add Remark {admin.role === "areaadmin" ? " / Close Grievance" : ""}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            label="Your Remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            margin="normal"
          />

          {admin.role === "areaadmin" && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Send Remark To</InputLabel>
                <Select
                  value={remarkTo}
                  onChange={(e) => setRemarkTo(e.target.value)}
                >
                  <MenuItem value="employee">Complainant (Employee)</MenuItem>
                  <MenuItem value="subsidiaryadmin">Subsidiary Admin</MenuItem>
                </Select>
              </FormControl>

              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Grievance Status</FormLabel>
                <RadioGroup
                  value={closeGrievance ? "closed" : "action_taken"}
                  onChange={(e) =>
                    setCloseGrievance(e.target.value === "closed")
                  }
                >
                  <FormControlLabel
                    value="action_taken"
                    control={<Radio />}
                    label="Keep as Action Taken"
                  />
                  <FormControlLabel
                    value="closed"
                    control={<Radio />}
                    label="Mark as Closed"
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}

          {admin.role === "subsidiaryadmin" && (
            <Typography sx={{ mt: 2 }}>
              This remark will be sent to the Area Admin.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRemarkSubmit}
            variant="contained"
            disabled={!remark}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActionTakenGrievances;
