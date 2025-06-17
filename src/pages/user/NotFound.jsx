// src/pages/NotFound.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6fa",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ fontWeight: "bold", px: 4, py: 1 }}
      >
        Go Home
      </Button>
    </Box>
  );
}
