import React, { useState } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, Badge, Tooltip, Typography, List, ListItem,
  Divider, RadioGroup, FormControlLabel, Radio
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

const GrievanceTable = ({
  title,
  grievances,
  showAssignButton = false,
  onAssignClick = () => {},
  onRemarkAdded = () => {},
}) => {
  const { admin, token } = useAdminAuth();
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [actionMode, setActionMode] = useState("remark"); // 'remark' or 'close'

  const openRemarkDialog = (grievance, viewOnly = false) => {
    setSelectedGrievance(grievance);
    setRemarkText("");
    setViewMode(viewOnly);
    setActionMode("remark");
    setRemarkDialogOpen(true);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRemarkDialogOpen(false);
      setSelectedGrievance(null);
      onRemarkAdded();
    } catch (err) {
      console.error("Failed to submit remark or close:", err);
    }
  };

  return (
    <Box>
      {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
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
              {admin?.role === "subsidiaryadmin" && <TableCell>Assigned To</TableCell>}
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grievances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No grievances to show.
                </TableCell>
              </TableRow>
            ) : (
              grievances.map((grievance) => (
                <TableRow key={grievance._id}>
                  <TableCell>{grievance._id.slice(-6)}</TableCell>
                  <TableCell>{grievance.user?.name || "N/A"}</TableCell>
                  <TableCell>{grievance.category?.name || "N/A"} / {grievance.subcategory?.name || "N/A"}</TableCell>
                  <TableCell>{grievance.unit?.name || "N/A"}</TableCell>
                  <TableCell>{moment(grievance.createdAt).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>
                    <Chip
                      label={grievance.status.replace("_", " ")}
                      color={statusColors[grievance.status] || "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  {admin?.role === "subsidiaryadmin" && (
                    <TableCell>{grievance.assignedAreaAdmin?.name || "Unassigned"}</TableCell>
                  )}
                  <TableCell>
                    {grievance.remarks?.length > 0 ? (
                      <Tooltip title={`${grievance.remarks.length} remark(s)`}>
                        <Badge color="primary" badgeContent={grievance.remarks.length}>
                          <Button size="small" onClick={() => openRemarkDialog(grievance, true)}>
                            View
                          </Button>
                        </Badge>
                      </Tooltip>
                    ) : (
                      <Chip label="None" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    {admin?.role === "subsidiaryadmin" && grievance.status === "submitted" && showAssignButton && (
                      <Button variant="outlined" size="small" onClick={() => onAssignClick(grievance)}>
                        Assign
                      </Button>
                    )}
                    {admin?.role === "areaadmin" && ["pending", "action_taken"].includes(grievance.status) && (
                      <Button variant="outlined" size="small" onClick={() => openRemarkDialog(grievance)}>
                        Add / Close
                      </Button>
                    )}
                    {admin?.role === "subsidiaryadmin" && grievance.status === "action_taken" && (
                      <Button variant="outlined" size="small" onClick={() => openRemarkDialog(grievance)}>
                        Add Remark
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={remarkDialogOpen} onClose={() => setRemarkDialogOpen(false)}>
        <DialogTitle>{viewMode ? "Remarks" : "Take Action"}</DialogTitle>
        <DialogContent>
          {viewMode ? (
            selectedGrievance?.remarks?.length > 0 ? (
              <List>
                {selectedGrievance.remarks.map((r, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <Box>
                        <Typography variant="body2"><strong>To:</strong> {r.to}</Typography>
                        <Typography variant="body1">{r.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.date).toLocaleString()}
                        </Typography>
                      </Box>
                    </ListItem>
                    {i !== selectedGrievance.remarks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>No remarks yet.</Typography>
            )
          ) : (
            <>
              <FormControl fullWidth sx={{ my: 2 }}>
                <RadioGroup
                  row
                  value={actionMode}
                  onChange={(e) => setActionMode(e.target.value)}
                >
                  <FormControlLabel value="remark" control={<Radio />} label="Send Remark" />
                  <FormControlLabel value="close" control={<Radio />} label="Close Grievance" />
                </RadioGroup>
              </FormControl>

              <TextField
                label={actionMode === "close" ? "Closing Remark (optional)" : "Remark"}
                fullWidth
                multiline
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                sx={{ my: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialogOpen(false)}>Cancel</Button>
          {!viewMode && (
            <Button
              variant="contained"
              onClick={submitRemark}
              disabled={actionMode === "remark" && !remarkText}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GrievanceTable;