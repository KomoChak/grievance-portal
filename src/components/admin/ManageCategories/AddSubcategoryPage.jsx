import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Stack, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "@/utils/axiosConfig";

export default function AddSubcategoryPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryId: "", name: "", description: "" });
  const [formError, setFormError] = useState({ categoryId: false, name: false, description: false });

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("/categories");
    setCategories(res.data);
  };

  const fetchSubcategories = async () => {
    const res = await axios.get("/categories/subcategories");
    setSubcategories(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      categoryId: !form.categoryId.trim(),
      name: !form.name.trim(),
      description: !form.description.trim(),
    };
    setFormError(errors);
    if (errors.categoryId || errors.name || errors.description) return;

    await axios.post("/categories/subcategories", form);
    setForm({ categoryId: "", name: "", description: "" });
    fetchSubcategories();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/categories/subcategories/${id}`);
    fetchSubcategories();
  };

  const handleEdit = (id) => {
    const sub = subcategories.find((s) => s._id === id);
    if (sub) {
      setForm({ categoryId: sub.category._id, name: sub.name, description: sub.description });
      handleDelete(id);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight={600} mb={3}>Subcategory</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: "#fff",
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          boxShadow: 2,
          mb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}
      >
        <TextField
          select
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          error={formError.categoryId}
          helperText={formError.categoryId ? "Required" : ""}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Subcategory Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={formError.name}
          helperText={formError.name ? "Required" : ""}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={formError.description}
          helperText={formError.description ? "Required" : ""}
          multiline
          minRows={2}
          required
        />
        <Box sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" size="large">Create</Button>
        </Box>
      </Box>

      <Typography variant="h6" fontWeight={600} mb={2}>Manage Subcategories</Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">No subcategories found.</TableCell></TableRow>
            ) : (
              subcategories.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.category?.name}</TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.description}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEdit(sub._id)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(sub._id)}><DeleteIcon /></IconButton>
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
