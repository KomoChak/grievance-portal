import React, { useState } from "react";
import {
  Paper, Typography, Box, Divider, TextField, Button, Stack, Chip, Input, FormControl, FormLabel,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const dummyComplaint = {
  grievanceNo: "G-2025-0012",
  subject: "Salary not credited",
  employee: "Amit Kumar",
  department: "Finance",
  date: "2025-05-27",
  description: "My salary for May 2025 has not been credited.",
  status: "Pending",
  history: [
    { action: "Submitted", date: "2025-05-27", by: "Amit Kumar" },
  ],
};

export default function ComplaintDetail({ complaint = dummyComplaint, canClose = true }) {
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleRemarkChange = (e) => setRemark(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle remark and file submission logic here
    alert("Remark submitted!");
  };

  const handleClose = () => {
    // Handle close logic here
    alert("Complaint closed!");
  };

  return (
    <Paper elevation={5} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" color="#1A237E" mb={2}>
        Grievance Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1} mb={2}>
        <Typography><b>Grievance No:</b> {complaint.grievanceNo}</Typography>
        <Typography><b>Subject:</b> {complaint.subject}</Typography>
        <Typography><b>Employee:</b> {complaint.employee}</Typography>
        <Typography><b>Department:</b> {complaint.department}</Typography>
        <Typography><b>Date:</b> {complaint.date}</Typography>
        <Typography><b>Description:</b> {complaint.description}</Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />

      {/* Action Section */}
      <Typography variant="h6" fontWeight="bold" color="#1A237E" mb={1}>
        Add Remark / Action
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} direction="column" mb={2}>
          <TextField
            label="Remark"
            value={remark}
            onChange={handleRemarkChange}
            multiline
            minRows={2}
            required
            fullWidth
          />
          <FormControl>
            <FormLabel>Attach File (optional)</FormLabel>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{ width: "fit-content", mt: 1 }}
            >
              {file ? file.name : "Choose File"}
              <Input
                type="file"
                onChange={handleFileChange}
                sx={{ display: "none" }}
              />
            </Button>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#1A237E", width: 150 }}
            >
              Submit Remark
            </Button>
            {canClose && (
              <Button
                variant="outlined"
                color="success"
                sx={{ width: 150 }}
                onClick={handleClose}
              >
                Close Complaint
              </Button>
            )}
          </Stack>
        </Stack>
      </form>

      {/* Complaint Status Section */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight="bold" color="#1A237E" mb={1}>
        Complaint Status
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Chip
          label={complaint.status}
          color={complaint.status === "Pending" ? "warning" : "success"}
          icon={<CheckCircleIcon />}
        />
        <Typography variant="body2" color="text.secondary">
          Last updated: {complaint.history[complaint.history.length - 1].date}
        </Typography>
      </Stack>
      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          History:
        </Typography>
        {complaint.history.map((h, idx) => (
          <Typography key={idx} variant="body2">
            {h.date}: {h.action} by {h.by}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
}