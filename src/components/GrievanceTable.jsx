import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Tooltip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DownloadIcon from "@mui/icons-material/Download";

const statusColor = {
  submitted: "default",
  pending: "warning",
  in_progress: "info",
  action_taken: "primary",
  closed: "success"
};

export default function GrievanceTable({ grievances = [], onView, onAssign, onDownload }) {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Grievance #</TableCell>
            <TableCell>Complainant</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Subsidiary</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Registered On</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grievances.length > 0 ? (
            grievances.map((g) => (
              <TableRow key={g._id} hover>
                <TableCell>{g._id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{g.user?.name || "Unknown"}</TableCell>
                <TableCell>{g.category}</TableCell>
                <TableCell>{g.subsidiary?.name || "-"}</TableCell>
                <TableCell>{g.area?.name || "-"}</TableCell>
                <TableCell>{g.unit?.name || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={g.status}
                    color={statusColor[g.status] || "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(g.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  {onView && (
                    <Tooltip title="View Details">
                      <IconButton onClick={() => onView(g)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onAssign && g.status !== "closed" && (
                    <Tooltip title="Assign">
                      <IconButton onClick={() => onAssign(g)}>
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDownload && g.attachment && (
                    <Tooltip title="Download File">
                      <IconButton onClick={() => onDownload(g)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="body2" color="text.secondary">
                  No grievances found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
