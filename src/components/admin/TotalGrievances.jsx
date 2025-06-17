import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const sampleData = [
  {
    id: 1,
    grievanceNo: "G-2025-0012",
    subject: "Salary not credited",
    employee: "Amit Kumar",
    department: "Finance",
    date: "2025-05-27",
    status: "Pending",
  },
  {
    id: 2,
    grievanceNo: "G-2025-0008",
    subject: "Payment processed",
    employee: "Ravi Gupta",
    department: "Finance",
    date: "2025-05-22",
    status: "Action Taken",
  },
  {
    id: 3,
    grievanceNo: "G-2025-0005",
    subject: "Laptop replaced",
    employee: "Manoj Kumar",
    department: "IT",
    date: "2025-05-14",
    status: "Closed",
  },
  {
    id: 4,
    grievanceNo: "G-2025-0014",
    subject: "System issue",
    employee: "Rahul Sharma",
    department: "IT",
    date: "2025-05-28",
    status: "Pending",
  },
];

function getStatusChip(status) {
  if (status === "Pending") {
    return <Chip label="Pending" color="warning" size="small" icon={<HourglassEmptyIcon fontSize="small" />} />;
  }
  if (status === "Action Taken") {
    return <Chip label="Action Taken" color="success" size="small" icon={<DoneAllIcon fontSize="small" />} />;
  }
  if (status === "Closed") {
    return <Chip label="Closed" color="primary" size="small" icon={<CheckCircleIcon fontSize="small" />} />;
  }
  return <Chip label={status} size="small" />;
}

export default function TotalGrievances() {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        minHeight: 400,
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3} color="#1A237E">
        Total Grievances
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#e8eaf6" }}>
            <TableRow>
              <TableCell>Grievance No.</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.grievanceNo}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{getStatusChip(row.status)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      sx={{
                        bgcolor: "#1A237E",
                        "&:hover": { bgcolor: "#3949ab" },
                        textTransform: "none",
                      }}
                    >
                      View
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {sampleData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    No grievances found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}