import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputLabel,
  Select,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Divider
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import SubjectIcon from "@mui/icons-material/Subject";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const subsidiaries = [
  "Northern Coalfields Limited",
  "Central Coalfields Limited",
  "Eastern Coalfields Limited",
  "Western Coalfields Limited",
  "South Eastern Coalfields Limited",
  "Mahanadi Coalfields Limited",
  "Bharat Coking Coal Limited",
  "North Eastern Coalfields",
  "Coal India HQ"
];

const categories = [
  "Salary/Payment",
  "Retirement Benefits",
  "Medical",
  "Promotion/Transfer",
  "Workplace Issues",
  "Others"
];

export default function GrievanceFormPage() {
  const [form, setForm] = useState({
    subsidiary: "",
    category: "",
    subject: "",
    details: "",
    date: "",
    attachment: null
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  // Validation
  const validate = () => {
    let temp = {};
    if (!form.subsidiary) temp.subsidiary = "Please select a subsidiary";
    if (!form.category) temp.category = "Please select a category";
    if (!form.subject) temp.subject = "Subject is required";
    if (!form.details) temp.details = "Please provide grievance details";
    if (!form.date) temp.date = "Please select a date";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Send to backend API here
    setSuccess(true);
    setForm({
      subsidiary: "",
      category: "",
      subject: "",
      details: "",
      date: "",
      attachment: null
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e3f2fd 0%, #fffde7 100%)",
        py: { xs: 3, md: 6 }
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 4,
              boxShadow: 6,
              background: "#fff",
              position: "relative"
            }}
          >
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <img
                src="/coal-india-logo.png"
                alt="Coal India"
                style={{
                  height: 60,
                  marginBottom: 8,
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: 8,
                  padding: 4,
                  boxShadow: "0 2px 8px rgba(21,101,192,0.08)"
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>
                Submit a Grievance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please fill out the form below. Fields marked with * are required.
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.subsidiary}>
                    <InputLabel>Subsidiary *</InputLabel>
                    <Select
                      name="subsidiary"
                      value={form.subsidiary}
                      label="Subsidiary *"
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      {subsidiaries.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                    {errors.subsidiary && (
                      <Typography color="error" variant="caption">{errors.subsidiary}</Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      name="category"
                      value={form.category}
                      label="Category *"
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      {categories.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <Typography color="error" variant="caption">{errors.category}</Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject *"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject || "Max 100 characters"}
                    inputProps={{ maxLength: 100 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SubjectIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Details *"
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    error={!!errors.details}
                    helperText={errors.details || "Describe your grievance (max 1000 characters)"}
                    multiline
                    minRows={4}
                    inputProps={{ maxLength: 1000 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Incident *"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    error={!!errors.date}
                    helperText={errors.date}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      height: "56px",
                      borderStyle: form.attachment ? "solid" : "dashed",
                      borderColor: form.attachment ? "#1565c0" : "#bdbdbd",
                      color: form.attachment ? "#1565c0" : "#757575",
                      bgcolor: form.attachment ? "#e3f2fd" : "#fafafa"
                    }}
                  >
                    {form.attachment ? form.attachment.name : "Attach File (optional)"}
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept=".pdf,image/*"
                    />
                  </Button>
                  {form.attachment && (
                    <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                      {form.attachment.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      fontWeight: "bold",
                      fontSize: 18,
                      letterSpacing: 1,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: 2
                    }}
                  >
                    Submit Grievance
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog open={success} onClose={() => setSuccess(false)}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutlineIcon color="success" />
            Grievance Submitted
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your grievance has been submitted successfully. You will receive a tracking ID via email/SMS.
          </Alert>
          <Typography>
            Thank you for bringing this to our attention. Our team will review your grievance and get back to you soon.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccess(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}