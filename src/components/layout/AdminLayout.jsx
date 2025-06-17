import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function ManageGrievances() {
  const [loading, setLoading] = useState(true);
  const [grievances, setGrievances] = useState([]);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Fetch grievances here
    // Example:
    // fetch("/api/grievances")
    //   .then(res => res.json())
    //   .then(data => { setGrievances(data); setLoading(false); })
    //   .catch(err => { setError("Failed to load"); setLoading(false); });
    setTimeout(() => {
      setGrievances([
        { id: "G001", employee: "Roshmi", status: "Pending", date: "2025-06-03", subject: "Salary Delay" },
        { id: "G002", employee: "Amit", status: "Closed", date: "2025-06-01", subject: "Leave Issue" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, color: "#1A237E", textAlign: { xs: "center", md: "left" } }}
      >
        Manage Grievances
      </Typography>
      <Paper sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, boxShadow: 0 }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : grievances.length === 0 ? (
          <Alert severity="info">No grievances found.</Alert>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grievances.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>{g.id}</TableCell>
                      <TableCell>{g.employee}</TableCell>
                      <TableCell>{g.subject}</TableCell>
                      <TableCell>{g.status}</TableCell>
                      <TableCell>{g.date}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ minWidth: 80, fontSize: { xs: 10, sm: 12 } }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
}