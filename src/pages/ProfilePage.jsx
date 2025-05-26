
import React, { useState } from "react";
import {
  Box, Paper, Typography, Avatar, Grid, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState({
    name: "Amit Sharma",
    empId: "CIL12345",
    email: "amit.sharma@coalindia.in",
    department: "Mining",
    subsidiary: "Northern Coalfields Limited"
  });
  const [form, setForm] = useState(profile);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    setProfile(form);
    setEdit(false);
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #e3f2fd 0%, #fffde7 100%)",
      py: 6
    }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                src="/avatar-placeholder.png"
                sx={{ width: 90, height: 90, mx: "auto", mb: 1 }}
              />
              <Typography variant="h5" fontWeight="bold">{profile.name}</Typography>
              <Typography variant="body2" color="text.secondary">{profile.empId}</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography>{profile.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                <Typography>{profile.department}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Subsidiary</Typography>
                <Typography>{profile.subsidiary}</Typography>
              </Grid>
            </Grid>
            <Button
              sx={{ mt: 3, fontWeight: "bold" }}
              variant="outlined"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* Edit Dialog */}
      <Dialog open={edit} onClose={() => setEdit(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Subsidiary"
            name="subsidiary"
            value={form.subsidiary}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}