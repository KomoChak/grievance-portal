import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField, Tooltip, Switch,
  Snackbar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "@/utils/axiosConfig"; // ✅ if you have path aliases set up for @
import { useAdminAuth } from "@/context/AdminAuthContext";


export default function ManageRegistrations() {
  const { admin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("/admins/all-admins", {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggleActive = async (id) => {
    try {
      await axios.put(`/admins/toggle-admin/${id}`, {}, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setSnackbar({ open: true, message: "Status updated." });
      fetchAdmins();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/admins/delete-admin/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setSnackbar({ open: true, message: "Admin deleted." });
      fetchAdmins();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.post(`/admins/reset-password/${id}`, {}, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setSnackbar({ open: true, message: "Password reset link triggered." });
    } catch (err) {
      console.error("Reset failed", err);
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
      a.mobile?.includes(search)
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, md: 4 } }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Manage Registrations
      </Typography>

      <TextField
        label="Search by name, email, code, or mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Subsidiary</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.employeeId}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.mobile || "-"}</TableCell>
                  <TableCell>{admin.subsidiary?.name || "-"}</TableCell>
                  <TableCell>{admin.area?.name || "-"}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>{admin.role}</TableCell>
                  <TableCell>
                    <Switch
                      checked={admin.isActive}
                      onChange={() => handleToggleActive(admin._id)}
                      color="success"
                    />
                    {admin.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Reset Password">
                      <IconButton color="primary" onClick={() => handleResetPassword(admin._id)}>
                        <LockResetIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(admin._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No admins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
}
