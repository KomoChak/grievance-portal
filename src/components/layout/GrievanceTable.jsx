// 📁 src/components/admin/layout/GrievanceTable.jsx
import React from "react";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function GrievanceTable({ grievances, onAssign, onView, onClose, onMessage }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Grievance #</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grievances.map((g) => (
            <TableRow key={g._id}>
              <TableCell>{g._id.slice(-6).toUpperCase()}</TableCell>
              <TableCell>{new Date(g.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{g.title}</TableCell>
              <TableCell>{g.user?.name || "Unknown"}</TableCell>
              <TableCell>
                <Chip label={g.status} color={
                  g.status === "submitted" ? "warning" :
                  g.status === "pending" ? "info" :
                  g.status === "action_taken" ? "primary" :
                  g.status === "closed" ? "success" :
                  "default"
                } />
              </TableCell>
              <TableCell align="center">
                {onAssign && (
                  <Button variant="outlined" onClick={() => onAssign(g)}>
                    Assign Admin
                  </Button>
                )}
                {onClose && (
                  <Button variant="outlined" color="success" onClick={() => onClose(g._id)} sx={{ ml: 1 }}>
                    Close
                  </Button>
                )}
                {onMessage && (
                  <Button variant="outlined" color="secondary" onClick={() => onMessage(g._id)} sx={{ ml: 1 }}>
                    Message
                  </Button>
                )}
                {(!onAssign && !onClose && !onMessage) && (
                  <IconButton onClick={() => onView?.(g)}>
                    <VisibilityIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
