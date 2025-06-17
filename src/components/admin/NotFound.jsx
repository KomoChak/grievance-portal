import React from 'react';
import { Typography, Box } from '@mui/material';

export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2" color="#1A237E" fontWeight="bold">404</Typography>
      <Typography variant="h5" color="#666">Page Not Found</Typography>
    </Box>
  );
}
