import React, { useState, useEffect } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Badge, Tooltip, CircularProgress, Alert,
  Typography, List, ListItem, Divider, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import axios from "../../../utils/axiosConfig";
import moment from "moment";

const statusColors = {
  submitted: "warning",
  pending: "info",
  action_taken: "primary",
  closed: "success",
};

const PendingGrievances = () => {
  const { admin, token } = useAdminAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [actionMode, setActionMode] = useState("remark");
  const [viewMode, setViewMode] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const endpoint =
        admin.role === "subsidiaryadmin"
          ? "/grievances/subsidiary"
          : "/grievances/assigned";

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filtered = res.data.grievances.filter((g) => g.status === "pending");
      setGrievances(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch grievances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const openRemarkDialog = (grievance) => {
    setSelectedGrievance(grievance);
    setRemarkText("");
    setRemarkDialogOpen(true);
    setViewMode(false);
    setActionMode("remark");
  };

  const submitRemark = async () => {
    if (!selectedGrievance) return;

    const payload = {
      to: "employee",
      ...(remarkText && { remark: remarkText }),
      ...(actionMode === "close" && { close: true }),
    };

    try {
      await axios.post(
        `/admins/grievances/${selectedGrievance._id}/add-remark`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRemarkDialogOpen(false);
      fetchGrievances();
    } catch (err) {
      console.error("Failed to submit remark or close:", err);
    }
  };

  return (
    <Box p={3}>
      <h2>Pending Grievances</h2>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : grievances.length === 0 ? (
        <Alert severity="info">No pending grievances found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grievances.map((grievance) => (
                <TableRow key={grievance._id}>
                  <TableCell>{grievance._id.slice(-6)}</TableCell>
                  <TableCell>{grievance.user?.name || "N/A"}</TableCell>
                  <TableCell>
                    {grievance.category?.name || "N/A"} / {grievance.subcategory?.name || "N/A"}
                  </TableCell>
                  <TableCell>{grievance.unit?.name || "N/A"}</TableCell>
                  <TableCell>
                    {moment(grievance.createdAt).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={grievance.status.replace("_", " ")}
                      color={statusColors[grievance.status] || "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {grievance.remarks?.length > 0 ? (
                      <Tooltip title={`${grievance.remarks.length} remark(s)`}>
                        <Badge color="primary" badgeContent={grievance.remarks.length}>
                          <Button size="small" onClick={() => openRemarkDialog(grievance)}>View</Button>
                        </Badge>
                      </Tooltip>
                    ) : (
                      <Chip label="None" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {admin?.role === "areaadmin" && (
                      <Button variant="outlined" onClick={() => openRemarkDialog(grievance)}>
                        Add / Close
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={remarkDialogOpen} onClose={() => setRemarkDialogOpen(false)}>
        <DialogTitle>{viewMode ? "Remarks" : "Take Action"}</DialogTitle>
        <DialogContent>
          <RadioGroup
            row
            value={actionMode}
            onChange={(e) => setActionMode(e.target.value)}
            sx={{ my: 2 }}
          >
            <FormControlLabel value="remark" control={<Radio />} label="Send Remark" />
            <FormControlLabel value="close" control={<Radio />} label="Close Grievance" />
          </RadioGroup>

          <TextField
            label={actionMode === "close" ? "Closing Remark (optional)" : "Remark"}
            fullWidth
            multiline
            rows={3}
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            sx={{ my: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={submitRemark}
            disabled={actionMode === "remark" && !remarkText}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingGrievances;
