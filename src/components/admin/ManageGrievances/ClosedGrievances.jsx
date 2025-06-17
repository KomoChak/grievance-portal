import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
  Badge,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
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

const ClosedGrievances = () => {
  const { token } = useAdminAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  const fetchClosedGrievances = async () => {
    try {
const res = await axios.get("/grievances/closed", {

        headers: { Authorization: `Bearer ${token}` },
      });

      const closedGrievances = (res.data.grievances || res.data).filter(
        (g) => g.status === "closed"
      );

      setGrievances(closedGrievances);
    } catch (err) {
      console.error("Failed to fetch closed grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedGrievances();
  }, []);

  const handleViewRemarks = (grievance) => {
    setSelectedGrievance(grievance);
    setDialogOpen(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Closed Grievances
      </Typography>
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : grievances.length === 0 ? (
        <Typography>No closed grievances found.</Typography>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {grievances.map((grievance) => (
                <TableRow key={grievance._id}>
                  <TableCell>{grievance._id.slice(-6)}</TableCell>
                  <TableCell>{grievance.user?.name || "N/A"}</TableCell>
                  <TableCell>
                    {grievance.category?.name || "N/A"} /{" "}
                    {grievance.subcategory?.name || "N/A"}
                  </TableCell>
                  <TableCell>{grievance.unit?.name || "N/A"}</TableCell>
                  <TableCell>
                    {moment(grievance.createdAt).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={grievance.status}
                      color={statusColors[grievance.status] || "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {grievance.remarks?.filter((r) => r.to === "employee").length > 0 ? (
                      <Tooltip title="View all remarks">
                        <Badge
                          color="primary"
                          badgeContent={
                            grievance.remarks.filter((r) => r.to === "employee").length
                          }
                        >
                          <Button onClick={() => handleViewRemarks(grievance)} size="small">
                            View
                          </Button>
                        </Badge>
                      </Tooltip>
                    ) : (
                      <Chip label="None" size="small" variant="outlined" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Remarks to Employee</DialogTitle>
        <DialogContent>
          {selectedGrievance?.remarks?.filter((r) => r.to === "employee").length > 0 ? (
            <List>
              {selectedGrievance.remarks
                .filter((remark) => remark.to === "employee")
                .map((remark, i, arr) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <Box>
                        <Typography variant="body1">{remark.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(remark.date).toLocaleString()}
                        </Typography>
                      </Box>
                    </ListItem>
                    {i !== arr.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
            </List>
          ) : (
            <Typography>No remarks to show.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClosedGrievances;
