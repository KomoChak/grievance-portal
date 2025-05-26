import React, { useState } from "react";
import GrievanceList from "../components/GrievanceList";

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
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  TextField,
  TablePagination,
  Stack,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const STATUS_MAP = {
  Pending: { color: "warning", icon: <HourglassEmptyIcon fontSize="small" /> },
  Resolved: { color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  Rejected: { color: "error", icon: <ErrorOutlineIcon fontSize="small" /> },
};

const MOCK_GRIEVANCES = [
  {
    id: "G-1023",
    date: "2025-05-20",
    category: "Salary/Payment",
    subject: "Salary not credited",
    status: "Pending",
  },
  {
    id: "G-1022",
    date: "2025-05-18",
    category: "Medical",
    subject: "Medical reimbursement delay",
    status: "Resolved",
  },
  {
    id: "G-1021",
    date: "2025-05-15",
    category: "Workplace Issues",
    subject: "Unsafe equipment",
    status: "Rejected",
  },
  // ...more mock data
];

export default function MyGrievancesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = MOCK_GRIEVANCES.filter(
    (g) =>
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f6fa", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>
              My Grievances
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track and manage all your submitted grievances.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            href="/submit-grievance"
            sx={{ fontWeight: "bold", borderRadius: 2, px: 3 }}
          >
            Submit New Grievance
          </Button>
        </Stack>

        <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <TextField
              size="small"
              placeholder="Search by ID, Subject, or Category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: "#f5f6fa" },
              }}
              sx={{ width: { xs: "100%", sm: 300 } }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#e3f2fd" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">No grievances found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((g) => (
                    <TableRow key={g.id} hover sx={{ transition: "background 0.2s" }}>
                      <TableCell>{g.id}</TableCell>
                      <TableCell>{g.date}</TableCell>
                      <TableCell>{g.category}</TableCell>
                      <TableCell sx={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {g.subject}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={STATUS_MAP[g.status]?.icon}
                          label={g.status}
                          color={STATUS_MAP[g.status]?.color}
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton color="primary" href={`/grievances/${g.id}`}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton color="secondary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </Box>
    </Box>
  );
}