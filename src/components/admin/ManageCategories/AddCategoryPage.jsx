import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "@/utils/axiosConfig";

export default function AddCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState({ name: false, description: false });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      name: !form.name.trim(),
      description: !form.description.trim(),
    };
    setFormError(errors);
    if (errors.name || errors.description) return;

    await axios.post("/categories", form);
    setForm({ name: "", description: "" });
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/categories/${id}`);
    fetchCategories();
  };

  const handleEdit = (id) => {
    const cat = categories.find((c) => c._id === id);
    if (cat) {
      setForm({ name: cat.name, description: cat.description });
      handleDelete(id);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 3, px: 3, pb: 5 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>Category</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{
        background: "#fff", p: 4, borderRadius: 3, boxShadow: 3,
        maxWidth: 600, mx: "auto", mb: 5
      }}>
        <TextField
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={formError.name}
          helperText={formError.name ? "Required" : ""}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={formError.description}
          helperText={formError.description ? "Required" : ""}
          fullWidth
          multiline
          minRows={2}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2, fontWeight: 600 }}>
          Create
        </Button>
      </Box>

      <Typography variant="h6" fontWeight={600} mb={2}>Manage Categories</Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow><TableCell colSpan={3} align="center">No categories found.</TableCell></TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEdit(cat._id)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(cat._id)}><DeleteIcon /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
