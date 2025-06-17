import React from 'react';
import { Typography, Box } from '@mui/material';

export default function PendingGrievances({ adminRole }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700}>Pending Grievances</Typography>
      <Typography>Role: {adminRole}</Typography>
    </Box>
  );
}
