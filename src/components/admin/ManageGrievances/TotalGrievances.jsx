import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip
} from "@mui/material";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function TotalGrievances() {
  const [grievances, setGrievances] = useState([]);
  const { token } = useAdminAuth();
  const navigate = useNavigate();

useEffect(() => {
  const fetchGrievances = async () => {
    try {
const res = await axios.get("http://localhost:5000/api/admins/grievances", {

        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Grievances API response:", res.data);

      const data = Array.isArray(res?.data?.grievances) ? res.data.grievances : [];

      const formatted = data.map((g) => ({
        grievanceNo: `CIL/${g._id.slice(-3).toUpperCase()}/${new Date(g.createdAt).getFullYear().toString().slice(-2)}`,
        complainant: g.user?.name || "N/A",
        empId: g.user?.employeeId || "N/A",
        regDate: new Date(g.createdAt).toLocaleString(),
        status:
          g.status === "closed"
            ? "Closed"
            : g.status === "action_taken" || g.status === "pending"
            ? "In Process"
            : "Pending",
        subsidiary: g.subsidiary?.name || "N/A",
        area: g.area?.name || "N/A",
        unit: g.unit?.name || "N/A",
        category: g.category || "N/A",
        subcategory: g.subcategory || "N/A",
        _id: g._id
      }));

      setGrievances(formatted);
    } catch (err) {
      console.error("Failed to load grievances", err);
    }
  };

  fetchGrievances();
}, [token]);


  const handleView = (id) => {
    navigate(`/admin/grievances/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        All Grievances Overview
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Grievance No</TableCell>
              <TableCell>Complainant</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Registered On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subsidiary</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grievances.length > 0 ? (
              grievances.map((g, idx) => (
                <TableRow key={idx}>
                  <TableCell>{g.grievanceNo}</TableCell>
                  <TableCell>{g.complainant}</TableCell>
                  <TableCell>{g.empId}</TableCell>
                  <TableCell>{g.regDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={g.status}
                      color={
                        g.status === "Closed"
                          ? "success"
                          : g.status === "In Process"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{g.subsidiary}</TableCell>
                  <TableCell>{g.area}</TableCell>
                  <TableCell>{g.unit}</TableCell>
                  <TableCell>{g.category}</TableCell>
                  <TableCell>{g.subcategory}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleView(g._id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No grievances found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
